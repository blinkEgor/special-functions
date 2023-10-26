class Effect {
    constructor(name, steps_left) {
        this.name = name;
        this.steps_left = steps_left;
    }
    get_name() {
        return this.name;
    }
    get_steps_left() {
        return this.steps_left;
    }
    count() {
        this.steps_left -= 1;
    }
}

class BleedingEffect extends Effect {
    constructor(name, steps_left, damage) {
        super(name, steps_left);
        this.damage = damage;
    }
    get_damage() {
        return this.damage;
    }
}

class RegeneartionEffect extends Effect {
    constructor(name, steps_left, heal) {
        super(name, steps_left);
        this.heal = heal;
    }
    get_heal_count() {
        return this.heal;
    }
}

class PassiveArmorEffect extends Effect {
    constructor(name, steps_left, armor) {
        super(name, steps_left);
        this.armor = armor;
    }
    get_armor() {
        return this.armor;
    }
}

// creation on site
const berserk = new class BerserkEffect extends Effect {
    constructor(name, steps_left) {
        super(name, steps_left);
    }
    get_damage_multiplier() {
        return 1.5;
    }
    get_resistance() {
        return -0.5;
    }
}();

// ________________________________________________________

class Item {
    constructor(name) {
        this.name = name;
    }
    get_name() {
        return this.name;
    }
}

class Weapon extends Item {
    constructor(name, damage, effect) {
        super(name);
        this.damage = damage;
        this.effect = effect;
    }
    get_damage() {
        return this.damage;
    }
    get_effect() {
        return this.effect;
    }
}

class Shield extends Item {
    constructor(name, armor) {
        super(name);
        this.armor = armor;
    }
    get_shield() {
        return this.armor;
    }
}

class Potion extends Item {
    constructor(name, effect) {
        super(name);
        this.effect = effect;
    }
    get_effect() {
        return this.effect;
    }
}

class HealPotion extends Potion {
    constructor(name, heal_count) {
        super(name, new RegeneartionEffect(name, 1, heal_count));
    }
}
class RegeneartionPotion extends Potion {
    constructor(name, steps, heal_count) {
        super(name, new RegeneartionEffect(name, steps, heal_count));
    }
}

// ________________________________________________________

class Inventory {
    constructor(container_size = 16) {
        this.container_size = container_size;
        this.container = Array();
    }
    set_item(idx, item) {
        /*
            idx - число
            item - объект от класса Item
        */
        if(!(item instanceof Item)) {
            throw new Error("item isn't instance of Item");
        }
        if(idx < 0 || idx > this.container_size) {
            throw new Error("idx out of bounds");
        }
        this.container[idx] = item;
    }
    get_item(idx) {
        /*
            idx - число
        */
        if(idx < 0 || idx > this.container_size) {
            throw new Error("idx out of bounds");
        }
        return this.container[idx];
    }
}

// ________________________________________________________________

class Entity {
    max_health;
    health;
    shield = 0;
    inventory = new Inventory(16);
    effects = Array();
    steps;
    max_steps;
    weapon_idx = -1;

    constructor(max_health = 100, max_steps = 3) {
        this.max_health = max_health;
        this.health = max_health;
        this.steps = max_steps;
        this.max_steps = max_steps;
    }

    gain_damage(damage, effect) {
        if(effect !== null) {
            this.effects.push(effect);
        }
        let dmg = damage;
        for(const effect in this.effects) {
            if(effect.get_resistance !== null) {
                dmg *= (1 - effect.get_resistance());
            }
        }
        let dmg_left = dmg - this.shield;
        if(dmg_left >= 0) {
            this.health = this.health - dmg_left;
            this.reset_shield();
        } else {
            this.shield -= damage;
        }
        if(this.health < 0) {
            this.health = 0;
        }
    }

    setup_shield(shield_count, effect) {
        if(effect !== null) {
            this.effects.push(effect);
        }
        let def = shield_count;
        this.effects.forEach(effect => {
            if(effect.get_def_incrementation !== null) {
                def += effect.get_def_incrementation();
            }
        });
        this.effects.forEach(effect => {
            if(effect.get_def_multiplier !== null) {
                def *= effect.get_def_multiplier();
            }
        });
        this.shield += def;
    }

    reset_shield() {
        this.shield = 0;
    }

    heal(heal_count, effect = null) {
        if(effect !== null) {
            this.effects.push(effect);
        }
        if(this.health < this.max_health) {
            this.health += heal_count;
        }
        if(this.health > this.max_health) {
            this.health = this.max_health;
        }
    }

    deal_damage(target, weapon) {
        if(weapon instanceof Weapon) {
            let dmg = weapon.get_damage();
            this.effects.forEach(effect => {
                if(effect.get_dmg_incrementation !== null) {
                    dmg += effect.get_dmg_incrementation();
                }
            });
            this.effects.forEach(effect => {
                if(effect.get_dmg_multiplier !== null) {
                    dmg *= effect.get_dmg_multiplier();
                }
            });
            target.gain_damage(dmg, weapon.get_effect());
        }
    }

    is_alive() {
        return this.health > 0;
    }

    step() {
        for(let i = 0; i < this.effects.length; i++) {
            const effect = this.effects[i];
            if(effect.get_damage !== null) {
                this.gain_damage(effect.get_damage(), null);
            }
            if(effect.get_heal_count !== null) {
                this.heal(effect.get_heal_count !== null);
            }
            if(effect.get_armor !== null) {
                this.heal(effect.get_armor(), null);
            }
            effect.count();
            if(effect.get_steps_left() <= 0) {
                this.effects[i] = null;
            }
        }
        this.effects = this.effects.filter(elem => elem != null);
    }

    get_weapon() {
        if(this.weapon_idx >= 0) {
            return this.inventory.get_item(this.weapon_idx);
        } else {
            return null;
        }
    }
}

// _____________________________________________________________

class Game {
    entities = Array();
    step_idx = -1;
    player_idx = -1;
    entities_count = 0;
    ally_idxes = Array();
    enemy_idxes = Array();

    constructor(allies_count, enemies_count) {
        this.entities_count = allies_count + enemies_count;
        this.step_idx = 0;
        this.player_idx = 0;

        for(let i = 0; i < this.entities_count; i++) {
            if(i < allies_count) {
                this.ally_idxes[this.ally_idxes.length] = i;
            } else if(i > allies_count && i < allies_count + enemies_count) {
                this.enemy_idxes[this.enemy_idxes.length] = i;
            }
        }
    }

    step(action, target_id = -1) {
        const entity = this.entities[this.step_idx];
        let target;
        if(target_id >= 0) {
            target = this.entities[target_id];
        } else {
            let lowest_health;
            let t_idx = -1;
            if(this.ally_idxes.includes(this.step_idx)) {
                lowest_health = this.entities[this.enemy_idxes[0]].health;
                for(let i = 1; i < this.enemy_idxes.length; i++) {
                    if(this.entities[this.enemy_idxes[i]].is_alive() && 
                       this.entities[this.enemy_idxes[i]].health < lowest_health) {
                        lowest_health = this.entities[this.enemy_idxes[i]].health;
                        t_idx = this.enemy_idxes[i];
                    }
                }
            } else if(this.enemy_idxes.includes(this.step_idx)) {
                lowest_health = this.entities[this.ally_idxes[0]].length;
                for(let i = 1; i < this.ally_idxes.length; i++) {
                    if(this.get_entity(this.ally_indexes[i]).is_alive() &&
                       this.get_entity(this.ally_indexes[i]).health < lowest_health) {
                        lowest_health = this.get_entity(this.ally_indexes[i]).health;
                        t_idx = this.ally_indexes[i];
                    }
                }
            }
            target = this.entities[t_idx];
        }
        if(action === 0) {
            entity.deal_damage(target, entity.get_weapon());
        } else if(action === 1) {
            entity.setup_shield(entity.get_weapon().get_armor(), entity.get_weapon());
        }
        entity.step();
        this.step_count(entity);
    }

    step_count(entity) {
        entity.steps -= 1;
        if(entity.steps <= 0) {
            entity.steps = entity.max_steps;
            this.step_idx += 1;
            if (this.step_idx >= this.entities_count) {
                this.step_idx = 0;
            }
        }
    }
}