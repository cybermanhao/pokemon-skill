# Ability System - Pokemon Showdown Reference

## Ability Hook System

Pokemon Showdown abilities are implemented through an event/hook system.

### Complete Hook List

```typescript
interface AbilityHooks {
  // ========== Entry/Exit ==========
  onStart?: (pokemon: Pokemon, source?: Pokemon, effect?: Effect) => boolean | void;
  onEnd?: (pokemon: Pokemon) => void;
  onSwitchIn?: (pokemon: Pokemon, source?: Pokemon, effect?: Effect) => boolean | void;
  onSwitchOut?: (pokemon: Pokemon) => void;

  // ========== Pre-Move ==========
  onBeforeMove?: (pokemon: Pokemon, target: Pokemon, move: Move) => boolean | void;
  onTryMove?: (pokemon: Pokemon, target: Pokemon, move: Move) => boolean | void;

  // ========== Hit Detection ==========
  onTryHit?: (target: Pokemon, source: Pokemon, move: Move) => boolean | null | void;
  onHit?: (target: Pokemon, source: Pokemon, move: Move) => void;
  onAfterMoveSecondary?: (target: Pokemon, source: Pokemon, move: Move) => void;
  onMiss?: (source: Pokemon, target: Pokemon, move: Move) => void;

  // ========== Damage Calculation ==========
  onBasePower?: (basePower: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | void;
  onModifyAtk?: (atk: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | false;
  onModifySpA?: (spa: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | false;
  onModifyDef?: (def: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | false;
  onModifySpD?: (spd: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | false;
  onModifySpe?: (spe: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | false;
  onModifyAccuracy?: (accuracy: number, pokemon: Pokemon, target: Pokemon, move: Move) => number | void;

  // ========== Damage Result ==========
  onAfterMoveSecondarySelf?: (source: Pokemon, target: Pokemon, move: Move) => void;
  onDamagingHit?: (pokemon: Pokemon, target: Pokemon, move: Move, damage: number) => void;

  // ========== HP Related ==========
  onCalculate?: (pokemon: Pokemon, target: Pokemon, move: Move, damage: number) => number | void;
  onHeal?: (pokemon: Pokemon, source: Pokemon, effect: Effect) => boolean | void;

  // ========== Status Related ==========
  onSetStatus?: (status: string, target: Pokemon, source: Pokemon, effect: Effect) => boolean | void;
  onAfterSetStatus?: (target: Pokemon, source: Pokemon, effect: Effect) => void;
  onStatusRemove?: (target: Pokemon) => void;

  // ========== Stat Changes ==========
  onBoost?: (boosts: Boosts, target: Pokemon, source: Pokemon, effect: Effect) => void;
  onAfterBoost?: (boosts: Boosts, target: Pokemon, source: Pokemon) => void;

  // ========== KO Related ==========
  onAfterKill?: (pokemon: Pokemon, target: Pokemon) => void;
  onFaint?: (pokemon: Pokemon, source: Pokemon, effect: Effect) => void;

  // ========== Weather/Terrain ==========
  onWeatherChange?: (pokemon: Pokemon) => void;
  onTerrainChange?: (pokemon: Pokemon) => void;

  // ========== Other ==========
  onTurn?: (pokemon: Pokemon) => void;
  onResidual?: (pokemon: Pokemon) => void;
  onEvolve?: (pokemon: Pokemon) => boolean | void;
}
```

## Ability Examples

### Weather-Setting Abilities

```typescript
const weatherAbilities = {
  Drought: {
    onStart(pokemon) {
      this.field.setWeather('sunnyday', pokemon);
    }
  },
  Drizzle: {
    onStart(pokemon) {
      this.field.setWeather('raindance', pokemon);
    }
  },
  Snow Warning: {
    onStart(pokemon) {
      this.field.setWeather('snow', pokemon);
    }
  }
};
```

### Terrain-Setting Abilities

```typescript
const terrainAbilities = {
  'Electric Surge': {
    onStart(pokemon) {
      this.field.setTerrain('electricterrain', pokemon);
    }
  },
  'Psychic Surge': {
    onStart(pokemon) {
      this.field.setTerrain('psychicterrain', pokemon);
    }
  },
  'Grassy Surge': {
    onStart(pokemon) {
      this.field.setTerrain('grassyterrain', pokemon);
    }
  },
  'Misty Surge': {
    onStart(pokemon) {
      this.field.setTerrain('mistyterrain', pokemon);
    }
  }
};
```

### Type Immunity Abilities

```typescript
const typeImmunityAbilities = {
  'Water Absorb': {
    onTryHit(target, source, move) {
      if (move.type === 'Water') {
        this.add('-activate', target, 'ability: Water Absorb');
        target.heal(target.maxhp / 4);
        return null;
      }
    }
  },
  'Flash Fire': {
    onTryHit(target, source, move) {
      if (move.type === 'Fire') {
        this.add('-activate', target, 'ability: Flash Fire');
        return null;
      }
    }
  },
  'Levitate': {
    onTryHit(target, source, move) {
      if (move.type === 'Ground' && !target.volatiles['ingrain']) {
        this.add('-activate', target, 'ability: Levitate');
        return null;
      }
    }
  },
  'Wonder Guard': {
    onTryHit(target, source, move) {
      if (move.category === 'Status') return;
      const typeMod = target.getMoveBoost(move);
      if (typeMod < 2) {
        this.add('-activate', target, 'ability: Wonder Guard');
        return null;
      }
    }
  }
};
```

### Status Immunity Abilities

```typescript
const statusImmunityAbilities = {
  'Limber': {
    onSetStatus(status, target, source, effect) {
      if (status.id === 'par') {
        this.add('-immune', target, '[from] ability: Limber');
        return null;
      }
    }
  },
  'Immunity': {
    onSetStatus(status, target, source, effect) {
      if (status.id === 'psn') {
        this.add('-immune', target, '[from] ability: Immunity');
        return null;
      }
    }
  },
  'Insomnia': {
    onSetStatus(status, target, source, effect) {
      if (status.id === 'slp') {
        this.add('-immune', target, '[from] ability: Insomnia');
        return null;
      }
    }
  }
};
```

### Stat-Boosting Abilities

```typescript
const boostAbilities = {
  'Intimidate': {
    onStart(pokemon) {
      for (const target of pokemon.adjacentFoes()) {
        if (!target.volatiles['intimidate']) {
          if (target.hasAbility('clearbody')) {
            this.add('-activate', target, 'ability: Clear Body');
          } else {
            this.add('-boost', target, 'atk', -1, pokemon);
            target.volatiles['intimidate'] = { source: pokemon };
          }
        }
      }
      this.add('-ability', pokemon, 'Intimidate', 'boost');
    }
  },
  'Moxie': {
    onAfterKill(pokemon, target) {
      this.add('-boost', pokemon, 'atk', 1, pokemon);
    }
  },
  'Huge Power': {
    onModifyAtk(atk, pokemon) {
      return atk * 2;
    }
  },
  'Pure Power': {
    onModifyAtk(atk, pokemon) {
      return atk * 2;
    }
  }
};
```

### Conditional Boost Abilities (Low HP)

```typescript
const conditionalBoostAbilities = {
  'Blaze': {
    onModifySpA(spa, pokemon, target, move) {
      if (move.type === 'Fire' && pokemon.hp <= Math.floor(pokemon.maxhp / 3)) {
        return Math.floor(spa * 1.5);
      }
    }
  },
  'Overgrow': {
    onModifyAtk(atk, pokemon, target, move) {
      if (move.type === 'Grass' && pokemon.hp <= Math.floor(pokemon.maxhp / 3)) {
        return Math.floor(atk * 1.5);
      }
    }
  },
  'Torrent': {
    onModifySpA(spa, pokemon, target, move) {
      if (move.type === 'Water' && pokemon.hp <= Math.floor(pokemon.maxhp / 3)) {
        return Math.floor(spa * 1.5);
      }
    }
  },
  'Swarm': {
    onModifyAtk(atk, pokemon, target, move) {
      if (move.type === 'Bug' && pokemon.hp <= Math.floor(pokemon.maxhp / 3)) {
        return Math.floor(atk * 1.5);
      }
    }
  }
};
```

### Move Power Boost Abilities

```typescript
const powerBoostAbilities = {
  'Technician': {
    onBasePower(basePower, pokemon, target, move) {
      if (basePower <= 60) {
        return Math.floor(basePower * 1.5);
      }
    }
  },
  'Iron Fist': {
    onBasePower(basePower, pokemon, target, move) {
      if (move.flags?.punch) {
        return Math.floor(basePower * 1.2);
      }
    }
  },
  'Reckless': {
    onBasePower(basePower, pokemon, target, move) {
      if (move.recoil || move.hasCrashDamage) {
        return Math.floor(basePower * 1.2);
      }
    }
  },
  'Sheer Force': {
    onBasePower(basePower, pokemon, target, move) {
      if (move.secondary?.chance && move.secondary.chance > 0) {
        return Math.floor(basePower * 1.3);
      }
    }
  }
};
```

### Damage Reduction Abilities

```typescript
const damageReductionAbilities = {
  'Magic Guard': {
    onDamage(damage, pokemon, source, effect) {
      // Prevents all indirect damage
      if (effect.id !== 'recoil' && effect.id !== 'drain' && effect.id !== ' Struggle') {
        return false;
      }
    }
  },
  'Bulletproof': {
    onTryHit(target, source, move) {
      if (move.isBullet) {
        this.add('-activate', target, 'ability: Bulletproof');
        return null;
      }
    }
  },
  'Soundproof': {
    onTryHit(target, source, move) {
      if (move.isSound) {
        this.add('-activate', target, 'ability: Soundproof');
        return null;
      }
    }
  }
};
```

### Special Effect Abilities

```typescript
const specialAbilities = {
  'Mold Breaker': {
    // Ignores target's abilities when attacking
    onModifyMove(move, pokemon) {
      move.ignoreAbility = true;
    }
  },
  'Trace': {
    onSwitchIn(pokemon) {
      for (const target of pokemon.adjacentFoes()) {
        if (!target.getAbility().isBreakable) {
          const ability = target.getAbility();
          pokemon.setAbility(ability);
          this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
          return;
        }
      }
    }
  },
  'Protosynthesis': {
    onStart(pokemon) {
      if (this.field.hasWeather('sunnyday')) {
        this.add('-activate', pokemon, 'ability: Protosynthesis', 'sun');
      }
    }
  }
};
```

## Ability Flags

```typescript
interface AbilityFlags {
  isBreakable: boolean;      // Can be copied by Role Play/Skill Swap
  isFieldAbility: boolean;   // Affects entire field
  ignoreAbility: boolean;    // Can be ignored by Mold Breaker
}
```

## Common Mistakes

1. **Priority confusion**: Priority is a **move** property, not an ability property. "Slow Start" (Slaking's ability) halves Attack and Speed for 5 turns - it has nothing to do with move priority.

2. **Ability priority vs move priority**: Some abilities have activation order in the event system, but this is different from move priority.

## References

- Pokemon Showdown Abilities Data: https://github.com/smogon/pokemon-showdown/blob/master/data/abilities.ts
- @pkmn/dex Ability API: https://github.com/pkmn/ps/tree/main/dex
