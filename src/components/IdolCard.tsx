/**
 * This component demo that you can make React component
 * interactable on client
 * https://docs.astro.build/en/guides/integrations-guide/react/
 * https://docs.astro.build/en/reference/directives-reference/#client-directives
 */

import { useState, Fragment, useEffect } from 'react'

import type { FunctionComponent } from 'react'
import type { Card } from '$types/Idol'

interface Props {
  id: number
}

export const IdolCard: FunctionComponent<Props> = props => {
  const { id } = props

  const [card, setCard] = useState<Card | null>(null)

  const shuffle = async () => {
    setCard(null)

    const card: Card = await fetch(`/shuffleCards?idolId=${id}`).then(o => {
      if (o.ok) return o.json()
      else throw new Error('card-fetch-failed')
    })

    setCard(card)
    // 642x802
  }

  useEffect(() => {
    shuffle()
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-2">
        {['Before', 'After'].map(section => (
          <div key={`section-${section}`} className="grid grid-cols-2 gap-2">
            <h2 className="col-span-2 text-center bg-gray-200 rounded-md text-sm font-bold">
              {section} Awaken
            </h2>
            {card === null ? (
              <Fragment>
                <div className="w-full aspect-[642/802] bg-gray-300 animate-pulse" />
                <div className="w-full aspect-[642/802] bg-gray-300 animate-pulse" />
              </Fragment>
            ) : (
              <Fragment>
                {(section === 'Before'
                  ? card.images.beforeAwaken
                  : card.images.afterAwaken
                ).map(card => (
                  <img
                    key={`card-${card}`}
                    src={card}
                    width={642}
                    height={802}
                  />
                ))}
              </Fragment>
            )}
          </div>
        ))}
      </div>
      <button
        className="bg-pink-500 text-white px-4 py-1 rounded-lg"
        onClick={shuffle}
      >
        Shuffle
      </button>
    </div>
  )
}
