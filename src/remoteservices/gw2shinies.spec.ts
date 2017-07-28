import * as assert from 'assert';
import { setAlternativeGet } from '../http';
import * as gw2shinies from './gw2shinies';
import * as Rx from 'rxjs/Rx';

describe('remoteservices/gw2shinies', () => {
    it('return an observable returning all the data at once', () => {
        // emulate the data
        setAlternativeGet(url =>
            url === 'https://www.gw2shinies.com/api/json/forge/' || url === 'https://www.gw2shinies.com/api/json/forge' ?
                Promise.resolve(JSON.stringify(data)) : Promise.reject(`Unknown url ${url}`)
        );
        var observable = gw2shinies.getRecipes();
        var events: any = [];
        observable.subscribe({
            next: value => events.push({ event: 'value', value: value }),
            error: error => events.push({ event: 'error', value: error })
        });
        return observable.toPromise().then(() => assert.deepEqual(events, [
            {
                event: 'value',
                value: [{
                    "type": "blueprint",
                    "target_recipe": "21260",
                    "recipe_item_1": "21156",
                    "recipe_item_1_quantity": "2",
                    "recipe_item_2": "19700",
                    "recipe_item_2_quantity": "5",
                    "recipe_item_3": "19722",
                    "recipe_item_3_quantity": "5",
                    "recipe_item_4": "20798",
                    "recipe_item_4_quantity": "1",
                    "average_yield": "1"
                }]
            }
        ]));
    });
});

const data = [
    {
        "type": "blueprint",
        "target_recipe": "21260",
        "recipe_item_1": "21156",
        "recipe_item_1_quantity": "2",
        "recipe_item_2": "19700",
        "recipe_item_2_quantity": "5",
        "recipe_item_3": "19722",
        "recipe_item_3_quantity": "5",
        "recipe_item_4": "20798",
        "recipe_item_4_quantity": "1",
        "average_yield": "1"
    }
];