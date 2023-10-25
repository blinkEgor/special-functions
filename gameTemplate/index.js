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