import { useEffect } from "react"
export default function Profile() {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <div>Profile</div>
  )
}
