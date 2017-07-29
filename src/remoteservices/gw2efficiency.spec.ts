import * as assert from 'assert';
import * as Rx from 'rxjs/Rx';
import { setAlternativeGet } from '../http';
import * as gw2efficiency from './gw2efficiency';
import checkObservable from './helperspec';

describe('remoteservices/gw2efficiency', () => {
    beforeEach(() => {
        setAlternativeGet(url =>
            url === "https://raw.githubusercontent.com/gw2efficiency/recipe-calculation/master/src/static/vendorItems.js" ?
                Promise.resolve(data) : Promise.reject(`Unknown url ${url}`)
        );
    });
    afterEach(() => {
        setAlternativeGet(null);
    });
    it('return an observable returning all the data at once', () => {
        var observable = gw2efficiency.getRecipes();
        return checkObservable(observable, [
            {
                event: 'value',
                value: [{
                    type: 'karma',
                    quantity: 25,
                    cost: 77,
                    npcs: [{ name: 'Disa', position: 'Snowslide Ravine, Dredgehaunt Cliffs [N]' }, { name: 'Lieutenant Pickins', position: 'Greystone Rise, Harathi Hinterlands [W]' }],
                    id: 12337
                }]
            }
        ]);
    });
});

const data = `export default {
  // Heart vendors
  12337: {type: 'karma', quantity: 25, cost: 77, npcs: [{name: 'Disa', position: 'Snowslide Ravine, Dredgehaunt Cliffs [N]'}, {name: 'Lieutenant Pickins', position: 'Greystone Rise, Harathi Hinterlands [W]'}]}
}`;