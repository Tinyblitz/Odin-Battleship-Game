import createShip from "./Ship.js";

const ship2 = createShip(2);
const ship6 = createShip(6);

describe("Check basic functions of ship", () => {
    test('Does ship take dmg and sink', () => { 
        ship2.hit();
        expect(ship2.isSunk()).toBe(false);
        ship2.hit();
        expect(ship2.isSunk()).toBe(true);
    });

    test('Does ship take multiple dmg', () => { 
        ship6.hit();
        expect(ship6.isSunk()).toBe(false);
        ship6.hit();
        expect(ship6.isSunk()).toBe(false);
        ship6.hit();
        ship6.hit();
        ship6.hit();
        ship6.hit();
        expect(ship6.isSunk()).toBe(true);
        ship6.hit();
        expect(ship6.isSunk()).toBe(true);
    });

    test('Does ship reset', () => { 
        expect(ship2.isSunk()).toBe(true);
        ship2.reset();
        expect(ship2.isSunk()).toBe(false);
    });
});

describe("Check Ship Interaction", () => {
    test('Can you set position of ship', () => {
        ship2.position = [2,3];
        expect(ship2.position).toEqual([2,3]);
    });

    test('Check Ship hitbox', () => {
        expect(ship2.isTouchingHitbox([2,2])).toBe(false);
        expect(ship2.isTouchingHitbox([2,3])).toBe(true);
        expect(ship2.isTouchingHitbox([2,4])).toBe(true);
        expect(ship2.isTouchingHitbox([2,5])).toBe(false);
        expect(ship2.isTouchingHitbox([1,3])).toBe(false);
        expect(ship2.isTouchingHitbox([1,4])).toBe(false);
        expect(ship2.isTouchingHitbox([1,10])).toBe(false);
        expect(ship2.isTouchingHitbox([3,3])).toBe(false);
        expect(ship2.isTouchingHitbox([3,4])).toBe(false);
    })

    test('Check direction toggle', () => {
        ship2.toggleDir();
        expect(ship2.isTouchingHitbox([2,3])).toBe(true);
        expect(ship2.isTouchingHitbox([2,4])).toBe(false);
        expect(ship2.isTouchingHitbox([2,2])).toBe(false);
        expect(ship2.isTouchingHitbox([1,3])).toBe(false);
        expect(ship2.isTouchingHitbox([3,3])).toBe(true);
        expect(ship2.isTouchingHitbox([4,3])).toBe(false);
        expect(ship2.isTouchingHitbox([3,2])).toBe(false);
        expect(ship2.isTouchingHitbox([3,5])).toBe(false);
    })
})