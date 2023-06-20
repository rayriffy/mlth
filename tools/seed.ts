import fs from 'fs'
import PQueue from 'p-queue'
import { load } from 'cheerio'

console.log('seeding data...')

const queue = new PQueue({ concurrency: 6 })
const fetchHandler = (o: Response) => {
  if (o.ok) return o.text()
  else {
    console.log(`${o.url} <-> ${o.status}`)
    throw o
  }
}

// list all idols
const idolsDOM = load(
  await fetch('https://imas.gamedbs.jp/mlth/').then(fetchHandler)
)

const idols = await Promise.all(
  idolsDOM('ul.dblst > li').map(async (_, el) => {
    const elementDOM = load(el)

    // get anchor link href
    const href = elementDOM('a').attr('href')!
    const idolId = Number(
      href.replace('https://imas.gamedbs.jp/mlth/chara/show/', '')
    )

    // get idol name, icon image
    const [, name, birthday] = elementDOM('a').html()!.trim().split('<br>')

    // read idol details
    const idolDOM = load(await fetch(href).then(fetchHandler))

    // get loading icon
    const loadingIcons = idolDOM(
      'article.d1_3 > div.tc.chara-img-wrapper > div:nth-child(3) > span'
    )
      .map((_, el) => el.attribs['data-img-url'])
      .get()

    // get cards
    const cards = await Promise.all(
      idolDOM(
        '#contents-main > section > section > article.d2_3 > ul:nth-child(5) > li'
      )
        .filter((_, el) => load(el)('a').text() !== '')
        .map((_, el) =>
          queue.add(async () => {
            const cardUrl = load(el)('a').attr('href')!
            const cardId = Number(
              cardUrl.replace(
                `https://imas.gamedbs.jp/mlth/chara/show/${idolId}/`,
                ''
              )
            )
            const cardName = load(el)('a').text()
            const cardIcon = load(el)('div').attr('style')!

            try {
              // get card images
              const cardDOM = load(
                await fetch(
                  `https://imas.gamedbs.jp/mlth/chara/show/${idolId}/${cardId}`
                ).then(fetchHandler)
              )
              const getCardImageAtIndex = (index: number) => {
                const val = cardDOM(
                  `article:nth-child(${index}) > a > img`
                ).attr('data-original')

                if (val === null) {
                  console.log(cardDOM(`article:nth-child(${index}) > a > img`))
                }

                return val
              }
              const cardImages = {
                beforeAwaken: [3, 4]
                  .map(getCardImageAtIndex)
                  .filter(o => o !== null),
                afterAwaken: [5, 6]
                  .map(getCardImageAtIndex)
                  .filter(o => o !== null),
              }

              return {
                id: cardId,
                name: cardName,
                icon: cardIcon.match(
                  /(https:\/\/imas\.gamedbs\.jp\/mlth\/image\/card\/icon\/[\w_]+\.png)/
                )![1],
                images: cardImages,
              }
            } catch (e) {
              return null
            }
          })
        )
        .filter(o => o !== null)
    )

    return {
      id: idolId,
      name,
      icons: loadingIcons,
      cards,
    }
  })
)

// write to file
await fs.promises.writeFile(
  'src/data/idols.ts',
  `import type { Idol } from '$types/Idol'\n\nexport const idols: Idol[] = ${JSON.stringify(
    idols,
    null,
    2
  )}`
)
