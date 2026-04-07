# Battle Core Mechanics - Pokemon Showdown Reference

## Turn Flow

```
1. Action Selection Phase
   - Both players select actions (move/switch/item)

2. Priority Sorting
   - Sort by move priority
   - Same priority: sort by speed

3. Action Execution
   - Execute actions one by one
   - Check for fainted after each action

4. End of Turn
   - Weather/terrain duration decreases
   - Residual damage
   - Item effects
   - End-of-turn abilities
```

## Action Priority

Priority is a **move property**, not an ability property.

### Gen 6+ Priority Table

| Priority | Moves | Notes |
|----------|-------|-------|
| +6 | - | |
| +5 | Follow Me, Rage Powder | Protection moves |
| +4 | Wide Guard, Quick Guard | |
| +3 | Feint | Breaks Protect |
| +2 | - | |
| +1 | Quick Attack, Aqua Jet, Vacuum Wave, Bullet Punch, Extremespeed | "Priority moves" |
| 0 | Most moves | Default |
| -1 | - | |
| -6 | Struggle | No moves available |

### Gen 1-5 Priority

| Priority | Notes |
|----------|-------|
| +1 | Quick Attack, etc. |
| 0 | Most moves |
| -1 | Struggle |

### Speed Calculation

```typescript
function calculateSpeed(pokemon: Pokemon): number {
  let speed = Math.floor(
    Math.floor(2 * pokemon.baseStats.spe + pokemon.ivs.spe + Math.floor(pokemon.evs.spe / 4)) 
    * pokemon.level / 100 + 5
  );
  
  // Nature modifier (1.1, 1.0, or 0.9)
  speed = Math.floor(speed * natureMod);
  
  // Boosts
  speed = Math.floor(speed * getBoostMultiplier(pokemon.boosts.spe));
  
  // Status: Paralysis halves speed
  if (pokemon.status === 'par') {
    speed = Math.floor(speed / 2);
  }
  
  // Items
  if (pokemon.item === 'Choice Scarf') speed = Math.floor(speed * 1.5);
  if (pokemon.item === 'Iron Ball') speed = Math.floor(speed / 2);
  
  // Abilities
  if (pokemon.hasAbility('Unburden') && !pokemon.item) {
    speed = Math.floor(speed * 2);
  }
  
  return Math.max(1, speed);
}
```

Speed ties: random selection

## Move Targeting

```typescript
type Target =
  | 'adjacentFoe'      // Doubles
  | 'adjacentAlly'
  | 'adjacentAllyOrSelf'
  | 'any'
  | 'normal'           // Single target
  | 'self'
  | 'allySide'
  | 'foeSide'
  | 'entireField'
  | 'all'
  | 'randomAdjacentFoe'
  | 'scripted';
```

## Charge/Two-Turn Moves

```typescript
// Solar Beam, Thunder, Sky Attack, Hyper Beam, etc.
if (move.isTwoTurnMove && !pokemon.volatiles.charging) {
  // First turn: charging
  return null;
}

// Second turn: check if interrupted by damage
if (pokemon.volatiles.charging) {
  if (!pokemon.hasVolatile('midwayThroughMove')) {
    // Cancelled - was hit during charge
    return null;
  }
}
```

## Event Hooks

```typescript
interface BattleEvents {
  onTurnStart?: (turn: number) => void;
  onBeforeMove?: (pokemon: Pokemon, target: Pokemon, move: Move) => boolean | void;
  onMove?: (pokemon: Pokemon, target: Pokemon, move: Move) => void;
  onHit?: (pokemon: Pokemon, target: Pokemon, move: Move, damage: number) => void;
  onMiss?: (pokemon: Pokemon, target: Pokemon, move: Move) => void;
  onTurnEnd?: (turn: number) => void;
  onBattleEnd?: (winner: Side, loser: Side) => void;
}
```

## References

- Pokemon Showdown Sim: https://github.com/smogon/pokemon-showdown/tree/master/sim
- Protocol: https://github.com/smogon/ps/blob/main/sim/PROTOCOL.md
