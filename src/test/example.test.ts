import { expect, fc } from './setup';

describe('Test Framework Setup', () => {
    it('should run a basic test', () => {
        expect(1 + 1).to.equal(2);
    });

    it('should run a property-based test', () => {
        fc.assert(
            fc.property(fc.integer(), fc.integer(), (a, b) => {
                return a + b === b + a;
            }),
            { numRuns: 100 }
        );
    });
});
