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