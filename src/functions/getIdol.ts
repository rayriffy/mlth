/**
 * These functions are assumed to be fetched from remote server.
 * But for the sake of simplicity, we will just use a local data.
 */

export const getIdol = async (id: number) => {
  const { idols } = await import('$data/idols')
  const idol = idols.find(o => o.id === id)

  if (!idol) throw new Error('not-found')
  else return idol
}
