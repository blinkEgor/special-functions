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