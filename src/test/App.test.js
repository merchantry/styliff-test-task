import ReactThreeTestRenderer from '@react-three/test-renderer';

test('App renders', async () => {
    const renderer = await ReactThreeTestRenderer.create(<App/>);
      
    // assertions using the TestInstance & Scene Graph
    console.log(renderer.toGraph())
})