# Status Conditions System - Pokemon Showdown Reference

## Status Types

### Status Categories

1. **Non-volatile status** - Persists until removed (brn, par, psn, slp, frz)
2. **Volatile status** - Can be removed by switching (confusion, flinched, etc.)
3. **Side conditions** - Affect one side of the field (spikes, stealth rock, toxic spikes, sticky web)
4. **Field conditions** - Affect the entire field (weather, terrain, trick room)

## Non-Volatile Status Conditions

### Burn (brn)

```typescript
brn: {
  name: 'brn',
  onStart(target) {
    target.setStatus('brn');
  },
  onResidual(target) {
    target.damage(Math.floor(target.maxhp / 16));
  },
  onModifyAtk(stat, target, source, move) {
    if (move?.category === 'Physical') {
      return Math.floor(stat / 2);
    }
  }
}
```

**Effects:**
- Damages for 1/16 max HP each turn
- Halves Attack stat for Physical moves

### Paralysis (par)

```typescript
par: {
  name: 'par',
  onStart(target) {
    target.setStatus('par');
  },
  onModifySpe(stat, target) {
    return Math.floor(stat / 2);
  },
  onBeforeMove(pokemon, target, move) {
    if (this.random(4) === 0) {
      this.add('-activate', pokemon, ' paralysis');
      return false;
    }
  }
}
```

**Effects:**
- Halves Speed
- 25% chance to be unable to move each turn

### Poison (psn)

```typescript
psn: {
  name: 'psn',
  onStart(target) {
    target.setStatus('psn');
  },
  onResidual(target) {
    target.damage(Math.floor(target.maxhp / 8));
  }
}
```

**Effects:**
- Damages for 1/8 max HP each turn

### Toxic Poison (tox)

```typescript
tox: {
  name: 'tox',
  onStart(target) {
    target.setStatus('tox');
    target.statusData.toxicTurns = 0;
  },
  onResidual(target) {
    const toxicTurns = target.statusData.toxicTurns++;
    target.damage(Math.floor(target.maxhp * (toxicTurns + 1) / 16));
  }
}
```

**Effects:**
- Damage increases each turn (1/16, 2/16, 3/16...)
- Maxes at 15/16 per turn

### Sleep (slp)

```typescript
slp: {
  name: 'slp',
  onStart(target, source, effect) {
    target.setStatus('slp');
    target.statusData.sleepTurns = this.random(1, 4);
  },
  onBeforeMove(pokemon) {
    if (pokemon.statusData.sleepTurns > 0) {
      pokemon.statusData.sleepTurns--;
      return false;
    }
    pokemon.clearStatus();
  }
}
```

**Effects:**
- Cannot use moves for 1-3 turns (random)
- Wake up early if hit

### Freeze (frz)

```typescript
frz: {
  name: 'frz',
  onStart(target) {
    target.setStatus('frz');
  },
  onBeforeMove(pokemon, target, move) {
    if (move.category !== 'Status') {
      this.add('-activate', pokemon, ' ability: Magician');
      return false;
    }
  },
  onHit(target, source, move) {
    if (move.type === 'Fire') {
      target.clearStatus();
    }
  }
}
```

**Effects:**
- Cannot use moves (except Fire-type moves)
- 20% chance to thaw each turn
- Can be thawed by Fire-type moves

## Volatile Status Conditions

### Confusion

```typescript
confusion: {
  name: 'confusion',
  onStart(target, source, effect) {
    const duration = effect?.duration || this.random(2, 5);
    target.addVolatile('confusion');
    target.volatiles.confusion.duration = duration;
  },
  onBeforeMove(pokemon) {
    if (this.random(2) === 0) {
      this.add('-activate', pokemon, ' confusion');
      const damage = this.actions.getDamage(pokemon, pokemon, { id: 'struggle' });
      this.damage(damage, pokemon, pokemon);
      return false;
    }
  },
  onEnd(target) {
    this.add('-end', target, 'confusion');
  }
}
```

**Effects:**
- 50% chance to hurt self instead of attacking
- Self-hit deals Physical damage with 40 base power

### Flinched

```typescript
flinched: {
  name: 'flinched',
  onBeforeMove(pokemon) {
    this.add('-activate', pokemon, 'flinched');
    return false;
  }
}
```

**Effects:**
- Cannot use move this turn
- Removed after checking

### Leech Seed

```typescript
leechseed: {
  name: 'leechseed',
  onStart(target) {
    target.addVolatile('leechseed');
  },
  onResidual(target) {
    const source = target.side.foe.pokemon.find(
      p => p && !p.fainted && p.hasVolatile('leechseed')
    );
    if (source) {
      this.add('-heal', target, source, 'leechseed');
      target.damage(target.maxhp / 8);
      source.heal(target.maxhp / 8);
    }
  }
}
```

### Curse

```typescript
curse: {
  name: 'curse',
  onStart(target, source) {
    source.addVolatile('curse');
    this.add('-start', source, 'curse', '[of] ' + target);
  },
  onResidual(source) {
    this.add('-damage', source, source.getHealth());
  }
}
```

### Attract

```typescript
attract: {
  name: 'attract',
  onStart(target, source) {
    if (source.gender === target.gender || source.gender === 'N' || target.gender === 'N') {
      return;
    }
    target.addVolatile('attract');
  },
  onBeforeMove(pokemon) {
    if (this.random(2) === 0) {
      this.add('-activate', pokemon, ' attract');
      return false;
    }
  }
}
```

**Effects:**
- 50% chance to be unable to move if opposite gender
- Does not affect genderless Pokemon

## Side Conditions

### Entry Hazards

```typescript
// Stealth Rock
stealthrock: {
  name: 'Stealth Rock',
  onStart(side) {
    side.addSideCondition('stealthrock');
  },
  onDamagingHitOrder: 1,
  onDamagingHit(damage, target, source, move) {
    const rockType = 'Rock';
    const typeMod = this.dex.getEffectiveness(rockType, target);
    if (typeMod > 0) {
      damage = Math.floor(damage + target.maxhp * 0.125 * typeMod);
    }
  }
}

// Toxic Spikes
toxicspikes: {
  name: 'Toxic Spikes',
  onStart(side) {
    side.addSideCondition('toxicspikes');
  },
  onEntryHazard(pokemon) {
    if (pokemon.hasType('Poison') || pokemon.hasType('Steel')) {
      return;
    }
    if (pokemon.side.conditions['toxicspikes']?.layers >= 2) {
      pokemon.setStatus('tox', source);
    } else {
      pokemon.setStatus('psn', source);
    }
  }
}

// Spikes
spikes: {
  name: 'Spikes',
  onStart(side) {
    side.addSideCondition('spikes');
  },
  onEntryHazard(pokemon) {
    const layers = pokemon.side.conditions['spikes']?.layers || 0;
    pokemon.damage(pokemon.maxhp * (0.0625 * layers));
  }
}

// Sticky Web
stickyweb: {
  name: 'Sticky Web',
  onStart(side) {
    side.addSideCondition('stickyweb');
  },
  onEntryHazard(pokemon) {
    if (!pokemon.hasVolatile('stickyweb')) {
      this.add('-boost', pokemon, 'spe', -1, pokemon);
    }
    pokemon.addVolatile('stickyweb');
  }
}
```

### Side Status Effects

```typescript
// Tailwind (speed doubled)
tailwind: {
  name: 'Tailwind',
  onStart(side) {
    side.addSideCondition('tailwind');
  },
  onStartEnd(pokemon) {
    pokemon.addVolatile('tailwind');
  },
  onResidualEnd(pokemon) {
    pokemon.removeVolatile('tailwind');
  }
}

// Reflect (damage to Defense halved)
reflect: {
  name: 'Reflect',
  onStart(side) {
    side.addSideCondition('reflect');
  },
  onStartEnd(pokemon) {
    pokemon.addVolatile('reflect');
  }
}

// Light Screen (damage to Sp. Def halved)
lightscreen: {
  name: 'Light Screen',
  onStart(side) {
    side.addSideCondition('lightscreen');
  },
  onStartEnd(pokemon) {
    pokemon.addVolatile('lightscreen');
  }
}

// Aurora Veil (both defenses halved, only in Hail)
auroraveil: {
  name: 'Aurora Veil',
  onStart(side) {
    side.addSideCondition('auroraveil');
  },
  onStartEnd(pokemon) {
    pokemon.addVolatile('auroraveil');
  }
}

// Safeguard (status immunity)
safeguard: {
  name: 'Safeguard',
  onStart(side) {
    side.addSideCondition('safeguard');
  },
  onSetStatus(status, target, source, effect) {
    if (target.side === target.side && effect?.status) {
      this.add('-activate', target, 'safeguard');
      return null;
    }
  }
}

// Mist (no stat drops)
mist: {
  name: 'Mist',
  onStart(side) {
    side.addSideCondition('mist');
  },
  onTryBoost(boost, target, source, effect) {
    if (effect.id === 'mist') return;
    if (source && target === source) return;
    let i: keyof Boosts;
    for (i in boost) {
      if (boost[i]! < 0) {
        if (!target.volatiles['mist']) {
          delete boost[i];
        }
      }
    }
  }
}
```

## Field Conditions

### Weather

```typescript
const weatherTypes = {
  sunnyday: {
    name: 'Sun',
    onStart(field, source, effect) {
      field.setWeather('sunnyday', source, effect);
    },
    onModifyMove(move, pokemon) {
      if (move.type === 'Fire') {
        move.stab = 2;
      }
      if (move.type === 'Water') {
        move.stab = 0.5;
      }
    },
    onResidual(field) {
      field.weatherData.duration--;
      if (field.weatherData.duration <= 0) {
        field.clearWeather();
      }
    }
  },
  raindance: {
    name: 'Rain',
    onStart(field, source, effect) {
      field.setWeather('raindance', source, effect);
    },
    onModifyMove(move, pokemon) {
      if (move.type === 'Water') {
        move.stab = 2;
      }
      if (move.type === 'Fire') {
        move.stab = 0.5;
      }
    }
  },
  sandstorm: {
    name: 'Sandstorm',
    onStart(field, source, effect) {
      field.setWeather('sandstorm', source, effect);
    },
    onResidual(field) {
      for (const pokemon of field.active) {
        if (!pokemon.hasType('Rock') && !pokemon.hasType('Ground') && !pokemon.hasType('Steel')) {
          if (!pokemon.hasAbility('Sand Rush')) {
            pokemon.damage(Math.floor(pokemon.maxhp / 16));
          }
        }
      }
    }
  },
  snow: {
    name: 'Snow',
    onStart(field, source, effect) {
      field.setWeather('snow', source, effect);
    }
  },
  desolateland: {
    name: 'Desolate Land',
    onStart(field, source, effect) {
      field.setWeather('desolateland', source, effect);
    }
  },
  primordialsea: {
    name: 'Primordial Sea',
    onStart(field, source, effect) {
      field.setWeather('primordialsea', source, effect);
    }
  },
  deltaStream: {
    name: 'Delta Stream',
    onStart(field, source, effect) {
      field.setWeather('deltastream', source, effect);
    }
  }
};
```

### Terrain

```typescript
const terrainTypes = {
  electricterrain: {
    name: 'Electric Terrain',
    onStart(field, source, effect) {
      field.setTerrain('electricterrain', source, effect);
    },
    onModifyMovePriority: -1,
    onModifyMove(move, pokemon) {
      if (pokemon.isGrounded()) {
        if (move.type === 'Electric') {
          move.stab = 2;
        }
      }
    }
  },
  grassyterrain: {
    name: 'Grassy Terrain',
    onStart(field, source, effect) {
      field.setTerrain('grassyterrain', source, effect);
    }
  },
  mistyterrain: {
    name: 'Misty Terrain',
    onStart(field, source, effect) {
      field.setTerrain('mistyterrain', source, effect);
    }
  },
  psychicterrain: {
    name: 'Psychic Terrain',
    onStart(field, source, effect) {
      field.setTerrain('psychicterrain', source, effect);
    }
  }
};
```

## Status Removal

### Natural Removal

- **Switch**: Removes all volatile statuses
- **Healing Wish**: Clears status when fainting
- **Natural Cure**: Clears status on switch-out
- **Refresh**: Clears status on self
- **Psycho Shift**: Can transfer status

### Move Effects

```typescript
// Aromatherapy
aromatherapy: {
  onHit(target, source, move) {
    for (const ally of target.side.pokemon) {
      ally.clearStatus();
    }
    this.add('-cureteam', target);
  }
}

// Heal Bell
healbell: {
  onHit(target, source, move) {
    for (const ally of target.side.pokemon) {
      ally.clearStatus();
    }
    this.add('-cureteam', target);
  }
}

// Safegaurd (prevents, doesn't cure)

// Mist (prevents stat drops)
```

## Status Interaction with Abilities

```typescript
// Limber - immune to paralysis
// Insomnia - immune to sleep
// Immunity - immune to poison
// Vital Spirit - immune to sleep (and raises Attack)
// Water Veil - immune to burn
// Oblivious - immune to infatuation and torpor
// Own Tempo - immune to confusion
// Shield Dust - blocks additional effects (but not status)
```

## References

- Pokemon Showdown Conditions: https://github.com/smogon/pokemon-showdown/blob/master/data/conditions.ts
- Status Data: https://github.com/smogon/pokemon-showdown/tree/master/data
