import { connectWebSocket } from "../../serving-websockets/mod.js"

export const ReloadScript = `
  <!-- injected by watch middlware -->
  <script type="text/javascript">
    const ${connectWebSocket.name} = ${connectWebSocket.toString()};
    ${connectWebSocket.name}(location, console)
  </script>
`