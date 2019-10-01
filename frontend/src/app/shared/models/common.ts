import { PPState, colors } from '../data/variable';

export class User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_password: string;
    user_avatar: string;
    is_verified: Number;
    token: string;
}
export class Skill {
    skill_id: string;
    skill_name: string;
    skill_image: string;
    skill_bgcolor: string;
    skill_userid: string;
    skill_state: string;

    constructor(skill) {
        this.skill_id = skill.skill_id || '';
        this.skill_name = skill.skill_name || '';
        this.skill_image = skill.skill_image || '';
        this.skill_bgcolor = skill.skill_bgcolor || colors[0].value;
        this.skill_userid = skill.skill_userid || 0;
        this.skill_state = skill.skill_state || PPState.Public;
    }
}
export class Ability {
    ability_id: string;
    ability_name: string;
    ability_image: string;
    ability_userid: string;
    ability_skillid: string;
    ability_tags: string[];
    ability_state: string;
    constructor(skill) {
        this.ability_id = skill.ability_id || '';
        this.ability_name = skill.ability_name || '';
        this.ability_image = skill.ability_image || '';
        this.ability_skillid = skill.ability_skillid || 0;
        this.ability_userid = skill.ability_userid || 0;
        this.ability_tags = skill.ability_tags || [];
        this.ability_state = skill.ability_state || PPState.Public;
    }
}
export class AbilityDetail {
    ad_id: string;
    ad_abilityid: string;
    ad_title: string;
    ad_description: string;
    ad_tags: string[];
    constructor(skill) {
        this.ad_id = skill.ad_id || '';
        this.ad_abilityid = skill.ad_abilityid || '';
        this.ad_title = skill.ad_title || '';
        this.ad_description = skill.ad_description || '';
        this.ad_tags = skill.ad_tags || [];
    }
}
export class Tag {
    tag_id: string;
    tag_name: string;
}
