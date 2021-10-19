# Balls in a box simulation

### Installation

Run:
`git clone https://github.com/merchantry/styliff-test-task.git`
`cd styliff-test-task`
`npm install`
`npm run start`

### Config

In `src/App.tsx` you can modify the following
```
const data: BallsProps = {
    numOfBalls: 20, // Number of balls to spawn
    numOfCells: 10, // Number of cells in the box. More cells == Worse performance
    cellSize: 20, // Size of each cell
    bounceCoolOff: 1000, // Same balls cannot bounce twice in the same period. They need to wait up to bounceCoolOff ms
    maxSpeed: 100, // Maximum speed that can be assigned to each ball per axis
    showCells: false // If you want to visualize containing cells of balls. Hinders performance a lot if set to true. Best used with low ball count to visualize (eg. 15)
}
```

### Testing
Run:
`npm run test`