var modal=document.getElementById("aboutModal");
var btn=document.getElementById("aboutButton");
var span=document.getElementsByClassName("close")[0];

let store=document.querySelector('.store');
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick=function() {
    modal.style.display = "none";
}

window.onclick = function(event){
    if(event.target==modal){
        modal.style.display = "none";
    }
}

let registers = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    H: 0,
    L: 0,
};
let flag={
    S:0,
    Z:0,
    AC:0,
    P:0,
    CY:0,
};
let memory=[];

let num = 0;
let arr = [0, 0, 0, 0];
let arr2 = [0, 0];
let buttons = document.querySelectorAll('button');
let hasRelx = false;
let hasNext = false;
let first=false;
let hasGo=false;

update2();
update("0000");
updateflags();
updateRegisters();

buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    let key = event.key.toUpperCase();

    let keyMap = {
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        'A': 'A',
        'B': 'B',
        'C': 'C',
        'D': 'D',
        'E': 'E',
        'F': 'F',
        'ENTER': 'EXE',
        'R': 'RESET',
        'G': 'GO',
        'N': 'NEXT',
        'X': 'relx',
    };

    let buttonId = keyMap[key];

    if (buttonId) {
        let button = document.getElementById(buttonId);
        if (button) {
            button.click();
            highlightButton(button);
        }
    }
}


function highlightButton(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 300);
}
function handleButtonClick(event) {
    console.log(num);
    let buttonId = event.target.id;
    let buttonClass = event.target.className;

    if(hasGo==true && buttonId=='EXE'){
        hasGo=false;
        execute(num);
    }
    if(buttonId==='RESET'){arr=[0,0,0,0];update('0000');num=0;update2();hasNext=false;hasGo=false;hasRelx=false;first=false;return;}
    if(buttonId==='GO'){hasGo=true;hasNext=false;first=false;num=0;return;}
    if (buttonId === 'relx') {
        hasRelx = true;
        update('0000');
        return;
    }
    if(!hasRelx && !hasGo)return;

    if ((buttonClass !== 'rightk' && !hasNext) || hasGo==true) {
        let leftScreenInput = document.querySelector('.screen .left p');
        let buttonText = event.target.textContent;

        arr.splice(0, 1);
        arr.push(buttonText);
        leftScreenInput.innerHTML = arr.join('');
        num = parseInt(arr.join(''));
    }

    if(buttonId=='NEXT'){
        let rightScreenInput = document.querySelector('.screen .right p');
        let buttonText = event.target.textContent;

        let existing=document.getElementById(`store-${num}`);
        let p=document.createElement('p');
        let wrapper=document.createElement('div');
        wrapper.classList.add('paragraph-wrapper');
        p.textContent=`${num} : ${memory[num]}`;
        p.id=`store-${num}`;
        if(existing){
            existing.textContent=p.textContent;
        }
        else{
            wrapper.appendChild(p);
            store.appendChild(wrapper);
        }

        hasNext = true;
        if(first)num+=1;
        rightScreenInput.innerHTML=memory[num] || '00';
        first=true;
        update(num);
        update2();
        return;
    }

    if (hasNext && buttonClass === 'leftk') {
        let rightScreenInput = document.querySelector('.screen .right p');
        let buttonText = event.target.textContent;

        arr2.splice(0,1);
        arr2.push(buttonText);
        rightScreenInput.innerHTML = arr2.join('');
        memory[parseInt(num)]=(arr2.join(''));
        console.log(memory);
    }
}

function update(num) {
    let rightScreenInput = document.querySelector('.screen .left p');
    rightScreenInput.innerHTML = num;
}

function update2() {
    let rightScreenInput = document.querySelector('.screen .right p');
    if(memory[num]==undefined) memory[num]='00'
    rightScreenInput.innerHTML = memory[num];
    arr2=[0,0];
}

function updateRegisters(){
    let a=document.querySelector("#AR");
    let b=document.querySelector("#BR");
    let c=document.querySelector("#CR");
    let d=document.querySelector("#DR");
    let e=document.querySelector("#ER");
    let h=document.querySelector("#HR");
    let l=document.querySelector("#LR");

    a.innerHTML=registers["A"];
    b.innerHTML=registers["B"];
    c.innerHTML=registers["C"];
    d.innerHTML=registers["D"];
    e.innerHTML=registers["E"];
    h.innerHTML=registers["H"];
    l.innerHTML=registers["L"];
}

function execute(address){
    while(true){
        let memo=find[memory[address]];
        memo=memo.split(' ');
        if(memo[0]=='HLT'){update('E000');break;}
        else if(memo[0]=='ADD'){instructions.ADD(memo[1]);address++;}
        else if(memo[0]=='MADD'){instructions.MADD(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='ADC'){instructions.ADC(memo[1]);address++;}
        else if(memo[0]=='MADC'){instructions.MADD(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='ADI'){instructions.ADI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='ACI'){instructions.ACI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='DAD'){instructions.DAD(memo[1].split(''));address++;}
        else if(memo[0]=='SBB'){instructions.SBB(memo[1]);address++;}
        else if(memo[0]=='SUI'){instructions.SUI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='SBI'){instructions.SBI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='SUB'){instructions.SUB(memo[1]);address++;}
        else if(memo[0]=='MSUB'){instructions.MSUB(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='INR'){instructions.INR(memo[1]);address++;}
        else if(memo[0]=='INX'){instructions.INX(memo[1].split(''));address++;}
        else if(memo[0]=='MINR'){instructions.MINR(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='DCR'){instructions.DCR(memo[1]);address++;}
        else if(memo[0]=='MDCR'){instructions.MDCR(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='DCX'){instructions.DCX(memo[1].split(''));address++;}
        else if(memo[0]=='MOV'){instructions.MOV(memo[2],memo[1]);address++;}
        else if(memo[0]=='MMOV'){instructions.MMOV(memo[1],memory[registers["H"]+registers["L"]]);address++;}
        else if(memo[0]=='MDMOV'){instructions.MDMOV(registers["H"]+registers["L"],memo[1]);address++;}
        // else if(memo[0]=='MMVI'){instructions.MMVI(memo[1],memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='MVI'){instructions.MVI(memo[1],memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='LXI'){instructions.LXI(memo[1].split(''),memory[address+2]+memory[parseInt(address)+1]);address+=3;}
        else if(memo[0]=='LDA'){instructions.LDA(memory[address+2]+memory[parseInt(address)+1]);address+=3;}
        else if(memo[0]=='LDAX'){instructions.LDAX(memo[1].split(''));address++;}
        else if(memo[0]=='LHLD'){instructions.LHLD(parseInt(address)+1);address+=3;}
        else if(memo[0]=='STA'){instructions.STA(parseInt(address)+1);address+=3;}
        else if(memo[0]=='STAX'){instructions.STAX(memo[1].split(''));address++;}
        else if(memo[0]=='SHLD'){console.log(address);instructions.SHLD(memory[address+2]+memory[parseInt(address)+1]);address+=3;}
        else if(memo[0]=='XCHG'){instructions.XCHG();}
        else if(memo[0]=='CMP'){instructions.CMP(memo[1]);address++;}
        else if(memo[0]=='MCMP'){instructions.MCMP(memory[address+2]*+memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='CPI'){instructions.CPI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='ANA'){instructions.ANA(memo[1]);address++;}
        else if(memo[0]=='MANA'){instructions.MANA(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='ANI'){instructions.ANI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='ORA'){instructions.ORA(memo[1]);address++;}
        else if(memo[0]=='MORA'){instructions.MORA(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='ORI'){instructions.ORI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='XRA'){instructions.XRA(memo[1]);address++;}
        else if(memo[0]=='MXRA'){instructions.MXRA(registers["H"]+registers["L"]);address++;}
        else if(memo[0]=='XRI'){instructions.XRI(memory[parseInt(address)+1]);address+=2;}
        else if(memo[0]=='RLC'){instructions.RLC();address++;}
        else if(memo[0]=='RRC'){instructions.RRC();address++;}
        else if(memo[0]=='RAL'){instructions.RAL();address++;}
        else if(memo[0]=='RAR'){instructions.RAR();address++;}
        else if(memo[0]=='CMA'){instructions.CMA();address++;}
        else if(memo[0]=='CMC'){instructions.CMC();address++;}
        else if(memo[0]=='STC'){instructions.STC();address++;}
        else {update('Err');break;}
        updateflags();
        updateRegisters();
    }
}
function updateflags(){
    let sign=document.querySelector('#sign');
    let zero=document.querySelector('#zero');
    let halfCarry=document.querySelector('#auxiliary');
    let carry=document.querySelector('#carry');
    let parity=document.querySelector('#parity');

    sign.innerHTML=flag["S"];
    zero.innerHTML=flag["Z"];
    halfCarry.innerHTML=flag["AC"];
    carry.innerHTML=flag["CY"];
    parity.innerHTML=flag["P"];
}
function convert(hex) {
    var decimal = parseInt(hex, 16);
    return parseInt(decimal);
}
function convert2(decimal) {
    var hex = decimal.toString(16).toUpperCase();
    if (hex.charAt(0) === '-') {
        hex = hex.substring(1);
    }
    return hex;
}

let find = {
    'CE': 'ACI Data',
    '8F': 'ADC A',
    '88': 'ADC B',
    '89': 'ADC C',
    '8A': 'ADC D',
    '8B': 'ADC E',
    '8C': 'ADC H',
    '8D': 'ADC L',
    '8E': 'MADC M',
    '87': 'ADD A',
    '80': 'ADD B',
    '81': 'ADD C',
    '82': 'ADD D',
    '83': 'ADD E',
    '84': 'ADD H',
    '85': 'ADD L',
    '86': 'MADD M',
    'C6': 'ADI Data',
    'A7': 'ANA A',
    'A0': 'ANA B',
    'A1': 'ANA C',
    'A2': 'ANA D',
    'A3': 'ANA E',
    'A4': 'ANA H',
    'A5': 'ANA L',
    'A6': 'MANA M',
    'E6': 'ANI Data',
    'CD': 'CALL Label',
    // Call on Condition
    'DC': 'CC Label',
    'FC': 'CM Label',
    // // Complement Accumulator
    '2F': 'CMA',
    // Complement Carry
    '3F': 'CMC',
    // Compare
    'BF': 'CMP A',
    'B8': 'CMP B',
    'B9': 'CMP C',
    'BA': 'CMP D',
    'BB': 'CMP E',
    'BC': 'CMP H',
    'BD': 'CMP L',
    // Compare Memory
    'BE': 'MCMP M',
    // Conditional Call
    'D4': 'CNC Label',
    // Conditional Call on Non-Zero
    'C4': 'CNZ Label',
    'EC': 'CPE Label',
    // Compare Label
    'F4': 'CP Label',
    // Compare Immediate
    'FE': 'CPI Data',
    // Call on Parity Odd
    'E4': 'CPO Label',
    // Call on Zero
    'CC': 'CZ Label',
    // Decimal Adjust Accumulator
    '27': 'DAA',
    // Double Add
    '09': 'DAD BC',
    '19': 'DAD DE',
    '29': 'DAD HL',
    '39': 'DAD SP',
    // Decrement Register
    '3D': 'DCR A',
    '05': 'DCR B',
    '0D': 'DCR C',
    '15': 'DCR D',
    '1D': 'DCR E',
    '25': 'DCR H',
    '2D': 'DCR L',
    '35': 'MDCR M',
    // Decrement Register Pair
    '0B': 'DCX BC',
    '1B': 'DCX DE',
    '2B': 'DCX HL',
    '3B': 'DCX SP',
    // Disable Interrupts
    'F3': 'DI',
    // Enable Interrupts
    'FB': 'EI',
    // Halt
    '76': 'HLT',
    // Input
    'DB': 'IN Port-address',
    // Increment Register
    '3C': 'INR A',
    '04': 'INR B',
    '0C': 'INR C',
    '14': 'INR D',
    '1C': 'INR E',
    '24': 'INR H',
    '2C': 'INR L',
    '34': 'MINR M',
    // Increment Register Pair
    '03': 'INX BC',
    '13': 'INX DE',
    '23': 'INX HL',
    '33': 'INX SP',
    // Jump on Carry
    'DA': 'JC Label',
    // Jump on Minus
    'FA': 'JM Label',
    // Jump
    'C3': 'JMP Label',
    // Jump on No Carry
    'D2': 'JNC Label',
    // Jump on No Zero
    'C2': 'JNZ Label',
    // Jump on Plus
    'F2': 'JP Label',
    // Jump on Parity Even
    'EA': 'JPE Label',
    // Jump on Parity Odd
    'E2': 'JPO Label',
    // Jump on Zero
    'CA': 'JZ Label',
    '3A': 'LDA Address',
    // Load Accumulator from Memory (BC)
    '0A': 'LDAX BC',
    // Load Accumulator from Memory (DE)
    '1A': 'LDAX DE',
    // Load H and L Direct
    '2A': 'LHLD HL',
    // Load Register Pair Immediate (BC)
    '01': 'LXI BC',
    // Load Register Pair Immediate (DE)
    '11': 'LXI DE',
    // Load Register Pair Immediate (HL)
    '21': 'LXI HL',
    // Load Stack Pointer Immediate
    '31': 'LXI SP',
    // Move Data Direct
    '7F': 'MOV A A',
    // Move Data Register to Register
    '78': 'MOV A B',
    '79': 'MOV A C',
    '7A': 'MOV A D',
    '7B': 'MOV A E',
    '7C': 'MOV A H',
    '7D': 'MOV A L',
    '7E': 'MMOV A M',
    '47': 'MOV B A',
    '40': 'MOV B B',
    '41': 'MOV B C',
    '42': 'MOV B D',
    '43': 'MOV B E',
    '44': 'MOV B H',
    '45': 'MOV B L',
    '46': 'MMOV B M',
    '4F': 'MOV C A',
    '48': 'MOV C B',
    '49': 'MOV C C',
    '4A': 'MOV C D',
    '4B': 'MOV C E',
    '4C': 'MOV C H',
    '4D': 'MOV C L',
    '4E': 'MMOV C M',
    '57': 'MOV D A',
    '50': 'MOV D B',
    '51': 'MOV D C',
    '52': 'MOV D D',
    '53': 'MOV D E',
    '54': 'MOV D H',
    '55': 'MOV D L',
    '56': 'MMOV D M',
    '5F': 'MOV E A',
    '58': 'MOV E B',
    '59': 'MOV E C',
    '5A': 'MOV E D',
    '5B': 'MOV E E',
    '5C': 'MOV E H',
    '5D': 'MOV E L',
    '5E': 'MMOV E M',
    '67': 'MOV H A',
    '60': 'MOV H B',
    '61': 'MOV H C',
    '62': 'MOV H D',
    '63': 'MOV H E',
    '64': 'MOV H H',
    '65': 'MOV H L',
    '66': 'MMOV H M',
    '6F': 'MOV L A',
    '68': 'MOV L B',
    '69': 'MOV L C',
    '6A': 'MOV L D',
    '6B': 'MOV L E',
    '6C': 'MOV L H',
    '6D': 'MOV L L',
    '6E': 'MMOV L M',
    '77': 'MDMOV M, A',
    '70': 'MDMOV M, B',
    '71': 'MDMOV M, C',
    '72': 'MDMOV M, D',
    '73': 'MDMOV M, E',
    '74': 'MDMOV M, H',
    '75': 'MDMOV M, L',
    // Move Data Immediate
    '3E': 'MVI A Data',
    '06': 'MVI B Data',
    '0E': 'MVI C Data',
    '16': 'MVI D Data',
    '1E': 'MVI E Data',
    '26': 'MVI H Data',
    '2E': 'MVI L Data',
    '36': 'MMVI M Data',
    // No Operation
    '00': 'NOP',
    // Logical OR
    'B7': 'ORA A',
    'B0': 'ORA B',
    'B1': 'ORA C',
    'B2': 'ORA D',
    'B3': 'ORA E',
    'B4': 'ORA H',
    'B5': 'ORA L',
    'B6': 'MORA M',
    // OR Immediate
    'F6': 'ORI Data',
    // Output
    'D3': 'OUT Port-Address',
    // Load Program Counter from HL
    'E9': 'PCHL',
    // Pop Register Pair
    'C1': 'POP B',
    'D1': 'POP D',
    'E1': 'POP H',
    'F1': 'POP PSW',
    // Push Register Pair
    'C5': 'PUSH B',
    'D5': 'PUSH D',
    'E5': 'PUSH H',
    'F5': 'PUSH PSW',
    // Rotate Accumulator Left
    '17': 'RAL',
    // Rotate Accumulator Right
    '1F': 'RAR',
    // Return on Carry
    'D8': 'RC',
    // Return
    'C9': 'RET',
    // Read Interrupt Mask
    '20': 'RIM',
    // Rotate Accumulator Left Through Carry
    '07': 'RLC',
    // Return on Minus
    'F8': 'RM',
    // Return on No Carry
    'D0': 'RNC',
    // Return on No Zero
    'C0': 'RNZ',
    // Return on Plus
    'F0': 'RP',
    // Return on Parity Even
    'E8': 'RPE',
    // Return on Parity Odd
    'E0': 'RPO',
    // Rotate Accumulator Right Through Carry
    '0F': 'RRC',
    // Restart
    'C7': 'RST 0',
    'CF': 'RST 1',
    'D7': 'RST 2',
    'DF': 'RST 3',
    'E7': 'RST 4',
    'EF': 'RST 5',
    'F7': 'RST 6',
    'FF': 'RST 7',
    // Return on Zero
    'C8': 'RZ',
    // Sub with Borrow Immediate
    '9F': 'SBB A',
    '98': 'SBB B',
    '99': 'SBB C',
    '9A': 'SBB D',
    '9B': 'SBB E',
    '9C': 'SBB H',
    '9D': 'SBB L',
    '9E': 'MSBB M',
    // Sub with Borrow
    'DE': 'SBI Data',
    // Store H and L Direct
    '22': 'SHLD Address',
    // Set Interrupt Mask
    '30': 'SIM',
    // Store H and L Direct
    'F9': 'SPHL',
    // Store Accumulator Direct
    '32': 'STA Address',
    // Store Accumulator Memory (BC)
    '02': 'STAX B',
    // Store Accumulator Memory (DE)
    '12': 'STAX D',
    // Set Carry
    '37': 'STC',
    // Subtract
    '97': 'SUB A',
    '90': 'SUB B',
    '91': 'SUB C',
    '92': 'SUB D',
    '93': 'SUB E',
    '94': 'SUB H',
    '95': 'SUB L',
    '96': 'MSUB M',
    // Subtract Immediate
    'D6': 'SUI Data',
    // Exchange H and L with D and E
    'EB': 'XCHG',
    // Exclusive OR
    'AF': 'XRA A',
    'A8': 'XRA B',
    'A9': 'XRA C',
    'AA': 'XRA D',
    'AB': 'XRA E',
    'AC': 'XRA H',
    'AD': 'XRA L',
    'AE': 'MXRA M',
    // Exclusive OR Immediate
    'EE': 'XRI Data',
    // Exchange Stack with HL
    'E3': 'XTHL'
}

let instructions={
        ADD: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"] += registers[srcReg];
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MADD: (address) => {
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] += memory[address];
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
    },
        ADC:(srcReg)=>{
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"]+=flag["CY"]+registers[srcReg];
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
    },
        MADC: (address) => {
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] +=flag["CY"]+memory[address];
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
    },
        ADI:(data)=>{
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            registers["A"]+=data;
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
    },
        ACI:(data)=>{
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            registers["A"]+=flag["CY"]+data;
            if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
            else flag["CY"]=0;
            flag["Z"]=registers["A"]==0?1:0;
            flag["S"]=registers["A"]<0?1:0;
            flag["P"]=checkParity(registers["A"]);
            registers["A"]=convert2(registers["A"]);
    },
        DAD: (regPair) => {
            registers["H"] = convert(registers["H"]);
            registers["L"] = convert(registers["L"]);
            let hlValue = (registers["H"] << 8) | registers["L"];

            registers[regPair[0]] = convert(registers[regPair[0]]);
            registers[regPair[1]] = convert(registers[regPair[1]]);
            let rpValue = (registers[regPair[0]] << 8) | registers[regPair[1]];

            let result = hlValue + rpValue;

            if (result > 0xFFFF) {
                flag["CY"] = 1;
                result &= 0xFFFF; // Take only the lower 16 bits
            } else {
                flag["CY"] = 0;
            }

            flag["Z"] = result === 0 ? 1 : 0;
            flag["P"] = checkParity(result);

            registers["H"] = (result & 0xFF00) >> 8;
            registers["L"] = result & 0x00FF;

            registers["H"] = convert2(registers["H"]);
            registers["L"] = convert2(registers["L"]);
        },
        SBB: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            let carry =flag["CY"];
            let result = registers["A"] - registers[srcReg] - carry;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            flag["CY"]=result<0 || result>255?1:0;
            registers["A"]=result;
            registers[srcReg]=convert2(registers[srcReg]);
            registers["A"]=convert2(registers["A"]);
        },
        SUI: (data) => {
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            let carry =flag["CY"];
            let result = registers["A"] - data - carry;
            flag["CY"]=result<0 || result>255?1:0;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"] = result;
            registers["A"]=convert2(registers["A"]);
        },
        SBI: (data) => {
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            let carry = flag["CY"];
            let result = registers["A"] - (data + carry);
            flag["CY"]=result<0 || result>255?1:0;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"] = result;
            registers["A"]=convert2(registers["A"]);
        },
        SUB: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"] -= registers[srcReg];
            let result=registers["A"];
            flag["CY"]=result<0 || result>255?1:0;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MSUB: (address) =>{
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] -= memory[address];
            let result=registers["A"];
            flag["CY"]=result<0 || result>255?1:0;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
        },
        INR: (reg) => {
            registers[reg]=convert(registers[reg]);
            registers[reg]++;
            let result=registers[reg];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers[reg]=convert2(registers[reg]);
        },
        INX: (regPair) => {
            registers[regPair[0]]=convert(registers[regPair[0]]);
            registers[regPair[1]]=convert(registers[regPair[1]]);
            let regPairValue = (registers[regPair[0]] << 8) | registers[regPair[1]];
            regPairValue++;
            registers[regPair[0]] = (regPairValue & 0xFF00) >> 8;
            registers[regPair[1]] = regPairValue & 0x00FF;
            let result=regPairValue;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers[regPair[0]]=convert2(registers[regPair[0]]);
            registers[regPair[1]]=convert2(registers[regPair[1]]);
        },
        MINR: (address) => {
            memory[address]=convert(memory[address]);
            memory[address]++;
            let result=memory[address];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            memory[address]=convert2(memory[address]);
        },
        DCR: (reg) => {
            registers[reg]=convert(registers[reg]);
            registers[reg]--;
            let result=registers[reg];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers[reg]=convert2(registers[reg]);
        },
        MDCR: (address) => {
            memory[address]=convert(memory[address]);
            memory[address]--;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            memory[address]=convert2(memory[address]);
        },
        DCX: (regPair) => {
            registers[regPair[0]]=convert(registers[regPair[0]]);
            registers[regPair[1]]=convert(registers[regPair[1]]);
            let regPairValue = (registers[regPair[0]] << 8) | registers[regPair[1]];
            regPairValue--;
            registers[regPair[0]] = (regPairValue & 0xFF00) >> 8;
            registers[regPair[1]] = regPairValue & 0x00FF;
            let result=regPairValue;
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers[regPair[0]]=convert2(registers[regPair[0]]);
            registers[regPair[1]]=convert2(registers[regPair[1]]);
        },

        MDMOV:(address,srcReg)=>{
            memory[address]=registers[srcReg];
        },
        MOV:(srcReg,desReg)=>{
            registers[desReg]=registers[srcReg];
        },
        MMOV:(desReg,address)=>{
            registers[desReg]=memory[address];
        },
        IMOV:(desReg,data)=>{
            registers[desReg]=data;
        },
        MMVI:(address,data)=>{
            memory[address]=data;
        },
        MVI:(desReg,data)=>{
            registers[desReg]=data;
        },
        LXI: (destRegPair, data) => {
            // console.log(data,destRegPair);
            data=convert(data);
            registers[destRegPair[0]] = (data & 0xFF00) >> 8;
            registers[destRegPair[1]] = data & 0x00FF;
            registers[destRegPair[0]]=convert2(registers[destRegPair[0]]);
            registers[destRegPair[1]]=convert2(registers[destRegPair[1]]);
        },
        LDA: (address) => {
            registers["A"] = memory[address];
            console.log(address);
            console.log(memory[address]);
        },
        LDAX: (regPair) => {
            registers[regPair[0]]=convert(registers[regPair[0]]);
            registers[regPair[1]]=convert(registers[regPair[1]]);
            registers["A"] = memory[(registers[regPair[0]] << 8) | registers[regPair[1]]];
            registers["A"]=convert2(registers["A"]);
            registers[regPair[0]]=convert2(registers[regPair[0]]);
            registers[regPair[1]]=convert2(registers[regPair[1]]);
        },
        LHLD:(address)=>{
            memory[address]=convert(memory[address]);
            memory[parseInt(address)+1]=convert(memory[parseInt(address)+1]);
            registers["L"]=memory[address];registers["H"]=memory[parseInt(address)+1];
            registers["L"]=convert2(registers["L"]);
            registers["H"]=convert2(registers["H"]);
        },
        STA:(address)=>{
            memory[memory[parseInt(address)+1]+memory[address]]=registers["A"];
        },
        STAX:(regPair)=>{memory[registers[regPair[1]]*100+registers[regPair[0]]]=registers["A"];},
        SHLD:(address)=>{memory[address]=registers["L"];memory[parseInt(address)+1]=registers["H"];},
        XCHG: () => { [registers["H"], registers["D"]] = [registers["D"], registers["H"]]; [registers["L"], registers["E"]] = [registers["E"], registers["L"]]; },

        CMP:(srcReg)=>{
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            let result = registers["A"]-registers[srcReg];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MCMP:(address)=>{
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            let result = registers["A"]-memory[address];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
        },
        CPI:(data)=>{
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            let result = registers["A"]-data;
            if(result<0)flag["CY"]=1;
            else if(result==0)flag["Z"]=1;
            else {flag["Z"]=0;flag["CY"]=0;};
            registers["A"]=convert2(registers["A"]);
        },
        ANA: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"] &= registers[srcReg];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MANA: (address) => {
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] &= memory[address];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
        },
        ANI: (data) => {
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            registers["A"] &= data;
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
        },
        ORA: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"] |= registers[srcReg];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MORA: (address) => {
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] |= memory[address];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
        },
        ORI: (data) => {
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            registers["A"] |= data;
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
        },
        XRA: (srcReg) => {
            registers["A"]=convert(registers["A"]);
            registers[srcReg]=convert(registers[srcReg]);
            registers["A"] ^= registers[srcReg];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            registers[srcReg]=convert2(registers[srcReg]);
        },
        MXRA: (address) => {
            registers["A"]=convert(registers["A"]);
            memory[address]=convert(memory[address]);
            registers["A"] ^= memory[address];
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
            memory[address]=convert2(memory[address]);
        },
        XRI: (data) => {
            registers["A"]=convert(registers["A"]);
            data=convert(data);
            registers["A"] ^= data;
            let result=registers["A"];
            flag["S"]=result<0?1:0;
            flag["Z"]=result==0?1:0;
            flag["P"]=checkParity(result);
            registers["A"]=convert2(registers["A"]);
        },
        RLC: () => {
            registers["A"]=convert(registers["A"]);
            let msb = (registers["A"] & 0x80) >> 7;
            registers["A"] = ((registers["A"] << 1) | flag["CY"]) & 0xFF;
            flag["CY"] = msb;
            registers["A"]=convert2(registers["A"]);
        },
        RRC: () => {
            registers["A"]=convert(registers["A"]);
            let lsb = registers["A"] & 0x01;
            registers["A"] = (registers["A"] >> 1) | (flag["CY"] << 7);
            flag["CY"] = lsb;
            registers["A"]=convert2(registers["A"]);
        },
        RAL: () => {
            registers["A"]=convert(registers["A"]);
            let msb = (registers["A"] & 0x80) >> 7;
            registers["A"] = ((registers["A"] << 1) | flag["CY"]) & 0xFF;
            flag["CY"] = msb;
            registers["A"]=convert2(registers["A"]);
        },
        RAR: () => {
            registers["A"]=convert(registers["A"]);
            let lsb = registers["A"] & 0x01;
            registers["A"] = (registers["A"] >> 1) | (flag["CY"] << 7);
            flag["CY"] = lsb;
            registers["A"]=convert2(registers["A"]);
        },
        CMA: () => {
            registers["A"]=convert(registers["A"]);
            registers["A"] = ~registers["A"] & 0xFF;
            registers["A"]=convert2(registers["A"]);
        },
        CMC: () => {
            flag["CY"] = flag["CY"] ? 0 : 1;
        },
        STC: () => {
            flag["CY"] = 1;
        },


        JMP:(Newaddress) => {address=Newaddress;},
        JC:(Newaddress) => {if(flag["CY"]==1)address=Newaddress;},
        JNC:(Newaddress) => {if(flag["CY"]==0)address=Newaddress;},
        JP:(Newaddress) => {if(flag["S"]==0)address=Newaddress;},
        JM:(Newaddress) => {if(flag["S"]==1)address=Newaddress;},
        JZ:(Newaddress) => {if(flag["Z"]==1)address=Newaddress;},
        JNZ:(Newaddress) => {if(flag["Z"]==0)address=Newaddress;},
        JPE:(Newaddress)=>{if(flag["P"]==1)address=Newaddress;},
        JPO:(Newaddress)=>{if(flag["P"]==0)address=Newaddress;},

        CALL:(Newaddress) => {
            stack.push(address);
            address=Newaddress;
        },
        CC:(Newaddress)=>{if(flag["CY"]==1){
            stack.push(address);
            address=Newaddress;}
        },
        CNC:(Newaddress)=>{if(flag["CY"]==1){
            stack.push(address);
            address=Newaddress;}
        },
        CP:(Newaddress)=>{if(flag["S"]==0){
            stack.push(address);
            address=Newaddress;}
        },
        CM:(Newaddress)=>{if(flag["S"]==0){
            stack.push(address);
            address=Newaddress;}
        },
        CZ:(Newaddress)=>{if(flag["Z"]==1){
            stack.push(address);
            address=Newaddress;}
        },
        CNZ:(Newaddress)=>{if(flag["Z"]==0){
            stack.push(address);
            address=Newaddress;}
        },
        CPE:(Newaddress)=>{if(flag["P"]==1){
            stack.push(address);
            address=Newaddress;}
        },
        CPO:(Newaddress)=>{if(flag["P"]==0){
            stack.push(address);
            address=Newaddress;}
        },

        RET: () => {
            address=stack.pop();
        },
        RC:(Newaddress)=>{if(flag["CY"]==1){address=Newaddress;}},
        RNC:(Newaddress)=>{if(flag["CY"]==0){address=Newaddress;}},
        RP:(Newaddress)=>{if(flag["S"]==0){address=Newaddress;}},
        RM:(Newaddress)=>{if(flag["S"]==1){address=Newaddress;}},
        RZ:(Newaddress)=>{if(flag["Z"]==1){address=Newaddress;}},
        RNZ:(Newaddress)=>{if(flag["Z"]==0){address=Newaddress;}},
        RPE:(Newaddress)=>{if(flag["P"]==1){address=Newaddress;}},
        RPO:(Newaddress)=>{if(flag["P"]==0){address=Newaddress;}},

        RST0:()=>{address=0;},
        RST1:()=>{address=8;},
        RST2:()=>{address=10;},
        RST3:()=>{address=18;},
        RST4:()=>{address=20;},
        RST5:()=>{address=28;},
        RST6:()=>{address=30;},
        RST7:()=>{address=38;},

        HLT: () => { halted = true; },
        DI: () => { interruptsEnabled = false; },
        EI: () => { interruptsEnabled = true; }
}

function checkParity(temp) {
    let count = 0;
    let t = temp.toString(); // Convert temp to string
    for (let i = 0; i < t.length; i++) {
        let bit = parseInt(t[i], 10); // Parse each character of the string
        if (bit) {
            count++;
        }
    }
    return count % 2 === 0?1:0;
}
