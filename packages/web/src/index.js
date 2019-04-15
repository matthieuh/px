import { AppRegistry } from 'react-native'

import App from 'components/src/App'

AppRegistry.registerComponent('px', () => App)
AppRegistry.runApplication('px', {
  rootTag: document.getElementById('root'),
})
