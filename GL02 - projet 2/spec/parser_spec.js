const Cours = require('../Classes/Cours');
const Creneau = require('../Classes/Creneau');
const CRUparser = require('../CRUparser');
/**
 * test unitaire qui permettent de tester les différentes spécificités du parser
 *
 * @author Dorian Boucher
 * */
describe("Program Syntactic testing of CRUparser", function (){
    beforeAll(function (){
            this.parser = new CRUparser();
    });

    it('should read split all the good lines in an array', function () {
        let input = 'Une ligne qui ne doit pas être scannée\n' +
            '+MATH01\n' +
            '1,C1,P=56,H=L 14:00-16:00,F1,S=B101//\n' +
            '1,D1,P=20,H=L 17:00-18:00,F1,S=B203//\n';

        expect(this.parser.tokenize(input)).toEqual(['+MATH01', '1,C1,P=56,H=L 14:00-16:00,F1,S=B101//', '1,D1,P=20,H=L 17:00-18:00,F1,S=B203//', '+endData']);
    });

    it('should put into different objects of type Cours a simulated input', function () {
        let input = 'Une ligne qui ne doit pas être scannée\n' +
            '+MATH01\n' +
            '1,C1,P=56,H=L 14:00-16:00,F1,S=B101//\n' +
            '+MATH02\n'

        expect(this.parser.parse(input)).toEqual([new Cours('+MATH01', [new Creneau('C1','56', 'Lundi', '14:00-16:00', 'F1', 'B101')]), new Cours('+MATH02', [])])
    });

    it('should organize cru files from a directory', function () {
        let directory = 'SujetA_data';
        this.parser.organizeParsing(directory);
        creneau = new Creneau('D1', '25', 'Vendredi', '9:00-12:00', 'F1', 'B103');
        creneau.UE = 'AP03';
        expect(this.parser.allCreneaux[0]).toEqual(creneau);
    });

    it('should not read a file with not any good lines', function () {
        let content = "Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud \nexercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum \ndolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia \ndeserunt mollit anim id est laborum.";
        expect(this.parser.parse(content)).toEqual([]);
    });

    it('should not read a non positive value for the population of a creaneau', function (){
       let content = 'Une ligne qui ne doit pas être scannée\n' +
           '+MATH01\n' +
           '1,C1,P=-36,H=L 14:00-16:00,F1,S=B101//\n';
       expect(this.parser.parse(content)).toEqual([new Cours('+MATH01', [])]);
    });

    it('should not read a creneau where some values are missing', function () {
        let content = 'Une ligne qui ne doit pas être scannée\n' +
            '+MATH01\n' +
            '1,DEIUZ,P=56,H=L 14:00-16:00,F1,S=//\n'
        expect(this.parser.parse(content)).toEqual([new Cours('+MATH01', [])]);
    });

    it('should not read a creneau where the horaire is not complete or invalid', function () {
        let content = 'Une ligne qui ne doit pas être scannée\n' +
            '+MATH01\n' +
            '1,C1,P=56,H=L 14:00-,F1,S=B101//\n' +
            '+MATH02\n' +
            '1,C1,P=56,H=L ,F1,S=B101//\n' +
            '+MATH03\n' +
            '1,C1,P=56,H=chose Invalide 12:00-14:00,F1,S=B101//\n';
        expect(this.parser.parse(content)).toEqual([new Cours('+MATH01', []),new Cours('+MATH02', []),new Cours('+MATH03', [])]);
    });

    it('should not read a non valid index for a creneau', function () {
        let content = 'Une ligne qui ne doit pas être scannée\n' +
            '+MATH01\n' +
            '1,C1,P=56,H=L 12:00-14:00,MACHIN,S=B101//\n';
        expect(this.parser.parse(content)).toEqual([new Cours('+MATH01', [])]);
    });

});
