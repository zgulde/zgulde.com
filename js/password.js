validChars = {
    lower: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    upper: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    nums: ['1','2','3','4','5','6','7','8','9','0'],
    special: ['!','#','$','%','&','*','+','-','/',':',';','=','?','@','^','_','|','~']
};

function getRand(min,max){
    return Math.floor( (Math.random() * (max-min+1) + min) );
}

function getChar (usingUpper, usingNums, usingSpecial) {
    var chars = [validChars.lower];
    
    if (usingUpper) chars.push(validChars.upper);
    if (usingNums) chars.push(validChars.nums);
    if (usingSpecial) chars.push(validChars.special);

    var charSubset = chars[getRand(0, chars.length-1)];
    return charSubset[getRand(0, charSubset.length-1)];
}

function getPassword (length) {
    var usingUpper = $('#upper-chkbx').is(':checked');
    var usingNums = $('#num-chkbx').is(':checked');
    var usingSpecial = $('#special-chkbx').is(':checked');
    var password = '';
    for (var i = 0; i < length; i++) {
        password += getChar(usingUpper,usingNums,usingSpecial);
    }
    return password;
}

$('#generate-btn').click(function(){
    var length = parseInt($('#length-select').val());
    var password = getPassword(length);
    animateMessage($('#display'), password);
    $('#pwd-display').val(password);
});

$('#pwd-display').click(function(){
    $(this).select();
});