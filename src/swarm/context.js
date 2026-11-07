import { createContext, useContext } from 'react'

export const SwarmContext = createContext(null)

// The id of the nearest enclosing <Build>, so children wait for their parent.
export const BuildParentContext = createContext(null)

export const useSwarm = () => useContext(SwarmContext)
