import { useSessionStorage } from "usehooks-ts"


export default function useSessionState(){
  const [sessionState, setSessionState] = useSessionStorage("session-state", {})
}