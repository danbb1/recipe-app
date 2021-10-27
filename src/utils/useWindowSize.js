import { useCallback, useState, useEffect } from "react"
import { debounce } from "lodash"

const useWindowSize = ref => {
  const windowGlobal = typeof window !== "undefined"

  const [windowSize, setWindowSize] = useState({
    windowWidth: windowGlobal ? window.innerWidth : undefined,
    windowHeight: windowGlobal ? window.innerHeight : undefined,
  })
  const [elSize, setElSize] = useState()

  const handleResize = () => {
    if (!windowGlobal) return

    setWindowSize({
      ...windowSize,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })

    if (ref && ref.current) {
      const newSize = ref.current?.getBoundingClientRect()

      setElSize({ width: newSize.width, height: newSize.height })
    }
  }

  const debouncedHandleResize = useCallback(debounce(handleResize, 400), [
    windowSize,
    elSize,
  ])

  useEffect(() => {
    if (windowGlobal) {
      handleResize()
      window.addEventListener("resize", debouncedHandleResize)
    }

    return () => window.removeEventListener("resize", debouncedHandleResize)
  }, [])

  return { windowSize, elSize }
}

export default useWindowSize
