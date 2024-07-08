import React from 'react';
import PortfolioScreen from './src/components/PortfolioScreen';
import { RecoilRoot } from 'recoil';

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <PortfolioScreen />
    </RecoilRoot>
  );
}
export default App;
