import { sample } from 'lodash-es'
import { idols } from '$data/idols'

import type { APIRoute } from 'astro'

export const get: APIRoute = async ctx => {
  try {
    const idolId = ctx.url.searchParams.get('idolId')

    const idol = idols.find(idol => idol.id === Number(idolId))
    if (!idol) throw new Error('idol-not-found')

    const pickedCard = sample(idol.cards)
    if (!pickedCard) throw new Error('card-not-found')

    return {
      body: JSON.stringify(pickedCard),
    }
  } catch (e) {
    if (e instanceof Error)
      return {
        status: 500,
        body: e.message,
      }
    else
      return {
        status: 500,
        body: 'internal error',
      }
  }
}
