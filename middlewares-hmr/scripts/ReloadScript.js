import { connectWebSocket, changeLocation } from "../../serving-websockets/mod.js"

export const ReloadScript = `
  <!-- injected by hmr middlware -->
  <script type="text/javascript">
    const ${changeLocation.name} = ${changeLocation.toString()}
    const ${connectWebSocket.name} = ${connectWebSocket.toString()};
    ${connectWebSocket.name}(location, console)
  </script>
`