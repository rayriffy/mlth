/**
 * These functions are assumed to be fetched from remote server.
 * But for the sake of simplicity, we will just use a local data.
 */

export const getIdols = async () => {
  const { idols } = await import('$data/idols')

  return idols
}
