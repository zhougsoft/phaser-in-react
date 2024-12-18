/**
 * Game.tsx - Phaser + React Integration
 * -----------------------------------------
 *
 * Architecture Overview:
 * 1. Component Structure
 *    - <Game/> (this component): Main game logic, UI elements, and state management
 *    - <PhaserScene/>: Handles Phaser scene instance lifecycle and canvas rendering
 *
 * 2. State Management Pattern:
 *    - Game state class objects stored in React refs for cross-render Phaser access
 *    - React state only used for UI updates
 *    - Phaser callbacks (preload/create/update) interface with game state object refs for game logic
 *    - React state updates triggered by Phaser callbacks based on the result of the game logic
 *    - UI components trigger updates based on React state
 *    - NOTE: React useState values cannot be accessed in Phaser callbacks, but their setters can be called
 *
 * 3. Input Flow:
 *    - JSX UI can trigger state changes, ex: buttons, inputs
 *    - Changes call game logic object refs
 *    - Game logic is applied based on these changes in the Phaser update loop
 *    - Updated values display in UI via React state setters called from the Phaser update loop
 */

import { useCallback, useRef, useState } from 'react'
import PhaserScene from './PhaserScene'

const Game = () => {
  // React Refs can be used for passing data between React and Phaser
  const something = useRef<{ msg: string }>()

  // React State for UI management and displaying game state
  const [reloadKey, setReloadKey] = useState(0)

  // Forces a fresh Phaser instance
  const reload = () => setReloadKey(prev => prev + 1)

  // ~~~ PHASER SCENE CALLBACKS ~~~

  // Runs once before the scene is created
  const onPreload = useCallback((scene: Phaser.Scene) => {
    // Load assets & other preperations here
  }, [])

  // Runs once when the scene is created
  const onCreate = useCallback((scene: Phaser.Scene) => {
    // Initialize game state objects & other scene setup here
    something.current = { msg: 'hello!' }
  }, [])

  // Runs every frame
  const onUpdate = useCallback(
    (scene: Phaser.Scene, time: number, delta: number) => {
      // Game logic & state updates here
      // Use the time & delta for time-based logic, and call React state setters for UI updates
      if (something.current) {
        console.log(something.current?.msg, time)
      }
    },
    []
  )

  return (
    <div
      style={{ position: 'relative', userSelect: 'none', overflow: 'hidden' }}>
      <PhaserScene
        key={reloadKey}
        onPreload={onPreload}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
      <button
        style={{ position: 'absolute', top: 0, left: 0, fontWeight: 'bold' }}
        onClick={reload}>
        RELOAD
      </button>
    </div>
  )
}

export default Game
