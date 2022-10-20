import { useRef, useEffect } from 'react'

export const useInterval = (callback: Function, timer: number, disabled: boolean) => {
  const intervalIdRef = useRef<Function>()

  useEffect(() => {
    intervalIdRef.current = callback
  }, [callback])

  useEffect(() => {
    const fn = () => {
      (intervalIdRef.current as Function)()
    }
    if (timer !== null && !disabled) {
      let intervalId = setInterval(fn, timer)
      return () => clearInterval(intervalId)
    }
  }, [timer])
}
