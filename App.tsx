import React from 'react';
import PortfolioScreen from './src/components/PortfolioScreen';
import { RecoilRoot } from 'recoil';
import { View } from 'react-native';

function App(): React.JSX.Element {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<View />}>
        <PortfolioScreen />
      </React.Suspense>
    </RecoilRoot>
  );
}
export default App;
