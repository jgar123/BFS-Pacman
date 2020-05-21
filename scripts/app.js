function main() {

  class Vector {
    constructor(y, x) {
      this.y = y,
      this.x = x,
      this.discovered = false
      this.parent = null
    }
  }

  const testGrid = []
  for (let y = 0; y < 20; y++) {
    const temp = []
    for (let x = 0; x < 20; x++) {
      temp.push(new Vector(y, x))
    }
    testGrid.push(temp)
  }

  function neighbourCells(grid, position) {
    const result = []
    if (position.x + 1) {
      result.push({ y: position.y, x: position.x + 1 })
    }
    if (position.x - 1) {
      result.push({ y: position.y, x: position.x - 1 })
    }
    if (position.y - 1) {
      result.push({ y: position.y - 1, x: position.x })
    }
    if (position.y + 1) {
      result.push({ y: position.y + 1, x: position.x })
    }

    return result.filter(coord => (coord.x  >= 0 && coord.x < grid.length) && (coord.y >= 0 && coord.y < grid.length))
  }

  function BFS(grid, start, goal) {

    const q = []
    start.discovered = true
    q.unshift(start)

    while (q.length > 0) {
      const v = q.pop()

      if (v.x === goal.x && v.y === goal.y) {
        return routeMap(v)
      }
      const adjacentCells = neighbourCells(grid, v)

      adjacentCells.forEach(coord => {
        if (grid[coord.y][coord.x].discovered === false) {
          grid[coord.y][coord.x].discovered = true
          grid[coord.y][coord.x].parent = v
          q.unshift(grid[coord.y][coord.x])
        }
      })

    }

  }

  // let path = BFS(testGrid, testGrid[0][0], testGrid[18][17])
  // const route = []
  

  // while (path.parent !== null) {
  //   route.unshift({ y: path.y, x: path.x })
  //   path = path.parent
  // }

  // console.log(route)

  function routeMap(vector) {
    let path = vector
    const route = []

    while (path.parent !== null) {
      route.unshift({ y: path.y, x: path.x })
      path = path.parent
    }

    return route
  }


  console.log(BFS(testGrid, testGrid[0][0], testGrid[18][17]))


}

window.addEventListener('DOMContentLoaded', main)