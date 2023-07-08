// Services
import * as util from "./Util";

// Types
import { Message } from "../types/Messages";


const params: Message = {}

export const setMessageParams = (message: Message) => {

    if(message.toNumbers) setPhoneNumbers(message)
    if(message.groupIds) setGroups(message)
    // if(message.Subject) setSubject(message)
    if(message.mediaFileId) setFileID(message)
    if(message.sendAt) setStampToSend(message)
    if(message.message) setMessage(message)
    // setMessageTypeID(message)

    return params
}


function setPhoneNumbers (message: Message) {

    if(!message.toNumbers) return

    if(!message.groupIds && ! message.toNumbers) 
        throw new Error("You must include either groups or phone numbers!")


    if(message.toNumbers instanceof Array) {

        const phoneNumbers = []

        for(let i in message.toNumbers) {
            phoneNumbers.push(cleanNumber(message.toNumbers[i]))
        }
        params.toNumbers = phoneNumbers
    }

}

function cleanNumber(number: string | number) {
    const regExp = new RegExp(/\d/,'g')
    const matches = number.toString().match(regExp)

    const cleanNumber = matches ? matches.join('') : ''

    if (cleanNumber.length != 10)  console.log(`Skipped ${cleanNumber}. Phone number needs to be 10 digits!`)
    
    return cleanNumber
        
    //throw new Error("Phone number needs to be 10 digits!")
}


function setGroups (message: Message) {

    if(!message.groupIds && ! message.toNumbers) 
        throw new Error("You must include either groups or phone numbers!")
    
    params.groupIds = message.groupIds
}


// function setSubject (message: Message) {

//     if(message.Subject && message.Subject.length > 13) 
//         throw new Error("You must include either groups or phone numbers!")

//     params.Subject = message.Subject
// }


function setFileID (message: Message) {
    params.mediaFileId = message.mediaFileId
}


function setStampToSend (message: Message) {
    params.sendAt = util.getTimestamp(message.sendAt)
}


function setMessage (message: Message) {
    params.message = message.message
}


// function setMessageTypeID (message: Message) {
//     if(!message.MessageTypeID) message.MessageTypeID = '1'
//     params.MessageTypeID = message.MessageTypeID
// }



/*

function fixPhoneAndCountry(num: string) {

    num = num.replaceAll("-0","")
    num = num.replaceAll("001 +1","1")
    num = num.replaceAll(num.match(/\D+/g),'')        // Remove non digits
    num = num.replace(num.match(/^00/),'')        // Remove preceding '00'
    num = num.replace(num.match(/^0/),'')         // Remove preceding '0'
  
    if(num.length > 10) {
  
      // Ceck if # is from US Islands or Canada 
      var us_canada = checkUsCanada(num)
  
      if(us_canada) {
  
        var country = us_canada.country
  
        if(country == "USA")
          var fixingNum = num.replace("1", "") 
        else 
          var fixingNum = num.replace("1", "'+1-") 
  
      }
      else {
        
        num = num.replace(num.match(/^1/),'')                           // Remove preceding '1' if wrongly chosen US
        var int = getCountryCode(num)
  
        var cc = int.code
        var country = int.country
  
        var fixingNum = num
        fixingNum = fixingNum.replace(cc+cc, '')                        // remove double country code
        fixingNum = fixingNum.replace(cc, '')                           // remove country code
        fixingNum = fixingNum.replace(fixingNum.match(/^0/), '')        // remove preceding '0' after country code
  
        fixingNum = `'+${cc}-` + fixingNum                              // adding characters + and - (for example '+234-789321654)
      }
  
    }
    else {
  
      var fixingNum = num
      var country = "USA"
    }
  
    return {phone: fixingNum, country: country}
  
  }
  //──────────────────────────────────────────────────────────────────────────────────────────────────────────
  
  function checkUsCanada(num) {
  
    var countries = {
      1664: "Montserrat",
      1649: "Turks and Caicos Islands",
      1441: "Bermuda",
      1767: "Dominica",
      1939: "Puerto Rico",
      1246: "Barbados",
      1758: "Saint Lucia",
      1869: "Saint Kitts and Nevis",
      1284: "Virgin Islands",
      1784: "Saint Vincent and the Grenadines",
      1264: "Anguilla",
      1671: "Guam",
      1340: "Virgin Islands",
      1868: "Trinidad and Tobago",
      1242: "Bahamas",
      1849: "Dominican Republic",
      1670: "Northern Mariana Islands",
      1473: "Grenada",
      1876: "Jamaica",
      1268: "Antigua and Barbuda",
      1684: "AmericanSamoa",
      1204: "Canada",
      1226: "Canada",
      1236: "Canada",
      1249: "Canada",
      1250: "Canada",
      1289: "Canada",
      1306: "Canada",
      1343: "Canada",
      1403: "Canada",
      1416: "Canada",
      1418: "Canada",
      1438: "Canada",
      1450: "Canada",
      1506: "Canada",
      1514: "Canada",
      1519: "Canada",
      1579: "Canada",
      1581: "Canada",
      1587: "Canada",
      1587: "Canada",
      1600: "Canada",
      1604: "Canada",
      1613: "Canada",
      1647: "Canada",
      1705: "Canada",
      1709: "Canada",
      1778: "Canada",
      1780: "Canada",
      1807: "Canada",
      1819: "Canada",
      1867: "Canada",
      1902: "Canada",
      1905: "Canada"
    }
  
    for(var cc in countries) {
  
      var reg = new RegExp("^" + cc)
  
      if(num.match(reg)) {
  
        return {code: cc, country: countries[cc]}
      }
    }
  
    if(num.match(/^1/) && num.length == 11)
      return {code: 1, country: "USA"}
    else
      return false
  }
  
  
  function getCountryCode(num) {
  
    var countries = {
      591: "Bolivia",
      872: "Pitcairn",
      421: "Slovakia",
      31: "Netherlands",
      268: "Swaziland",
      297: "Aruba",
      34: "Spain",
      255: "Tanzania",
      258: "Mozambique",
      262: "Reunion",
      238: "Cape Verde",
      218: "Libyan Arab Jamahiriya",
      856: "Laos",
      231: "Liberia",
      81: "Japan",
      998: "Uzbekistan",
      222: "Mauritania",
      359: "Bulgaria",
      387: "Bosnia and Herzegovina",
      65: "Singapore",
      374: "Armenia",
      265: "Malawi",
      264: "Namibia",
      675: "Papua New Guinea",
      253: "Djibouti",
      254: "Kenya",
      39: "Italy",
      968: "Oman",
      93: "Afghanistan",
      995: "Georgia",
      237: "Cameroon",
      54: "Argentina",
      971: "United Arab Emirates",
      40: "Romania",
      967: "Yemen",
      852: "Hong Kong",
      674: "Nauru",
      886: "Taiwan",
      46: "Sweden",
      594: "French Guiana",
      221: "Senegal",
      379: "Holy See (Vatican City State)",
      51: "Peru",
      673: "Brunei Darussalam",
      220: "Gambia",
      961: "Lebanon",
      682: "Cook Islands",
      373: "Moldova",
      855: "Cambodia",
      60: "Malaysia",
      691: "Micronesia",
      389: "Macedonia",
      212: "Morocco",
      370: "Lithuania",
      223: "Mali",
      249: "Sudan",
      243: "Congo",
      679: "Fiji",
      420: "Czech Republic",
      378: "San Marino",
      509: "Haiti",
      90: "Turkey",
      49: "Germany",
      504: "Honduras",
      229: "Benin",
      970: "Palestinian Territory",
      994: "Azerbaijan",
      507: "Panama",
      508: "Saint Pierre and Miquelon",
      692: "Marshall Islands",
      58: "Venezuela",
      597: "Suriname",
      236: "Central African Republic",
      423: "Liechtenstein",
      227: "Niger",
      501: "Belize",
      672: "Norfolk Island",
      960: "Maldives",
      242: "Congo",
      685: "Samoa",
      381: "Serbia",
      500: "South Georgia and the South Sandwich Islands",
      36: "Hungary",
      385: "Croatia",
      688: "Tuvalu",
      290: "Saint Helena",
      683: "Niue",
      234: "Nigeria",
      975: "Bhutan",
      599: "Netherlands Antilles",
      257: "Burundi",
      244: "Angola",
      376: "Andorra",
      596: "Martinique",
      590: "Saint Martin",
      880: "Bangladesh",
      98: "Iran",
      357: "Cyprus",
      43: "Austria",
      44: "United Kingdom",
      48: "Poland",
      63: "Philippines",
      593: "Ecuador",
      372: "Estonia",
      676: "Tonga",
      853: "Macao",
      32: "Belgium",
      95: "Myanmar",
      972: "Israel",
      246: "British Indian Ocean Territory",
      977: "Nepal",
      86: "China",
      33: "France",
      66: "Thailand",
      850: "Korea",
      689: "French Polynesia",
      20: "Egypt",
      261: "Madagascar",
      92: "Pakistan",
      358: "Finland",
      30: "Greece",
      380: "Ukraine",
      976: "Mongolia",
      299: "Greenland",
      45: "Denmark",
      687: "New Caledonia",
      291: "Eritrea",
      27: "South Africa",
      41: "Switzerland",
      240: "Equatorial Guinea",
      213: "Algeria",
      962: "Jordan",
      595: "Paraguay",
      224: "Guinea",
      252: "Somalia",
      230: "Mauritius",
      506: "Costa Rica",
      248: "Seychelles",
      47: "Svalbard and Jan Mayen",
      7: "Russia",
      680: "Palau",
      256: "Uganda",
      235: "Chad",
      232: "Sierra Leone",
      963: "Syrian Arab Republic",
      241: "Gabon",
      354: "Iceland",
      269: "Comoros",
      250: "Rwanda",
      233: "Ghana",
      77: "Kazakhstan",
      382: "Montenegro",
      598: "Uruguay",
      267: "Botswana",
      964: "Iraq",
      351: "Portugal",
      62: "Indonesia",
      677: "Solomon Islands",
      371: "Latvia",
      965: "Kuwait",
      356: "Malta",
      966: "Saudi Arabia",
      974: "Qatar",
      502: "Guatemala",
      82: "Korea",
      226: "Burkina Faso",
      94: "Sri Lanka",
      345: "Cayman Islands",
      377: "Monaco",
      64: "New Zealand",
      996: "Kyrgyzstan",
      245: "Guinea-Bissau",
      239: "Sao Tome and Principe",
      375: "Belarus",
      56: "Chile",
      52: "Mexico",
      260: "Zambia",
      251: "Ethiopia",
      973: "Bahrain",
      993: "Turkmenistan",
      61: "Australia",
      53: "Cuba",
      681: "Wallis and Futuna",
      266: "Lesotho",
      55: "Brazil",
      386: "Slovenia",
      263: "Zimbabwe",
      503: "El Salvador",
      352: "Luxembourg",
      686: "Kiribati",
      670: "Timor-Leste",
      84: "Vietnam",
      225: "Cote d'Ivoire",
      678: "Vanuatu",
      91: "India",
      355: "Albania",
      216: "Tunisia",
      57: "Colombia",
      228: "Togo",
      211: "South Sudan",
      350: "Gibraltar",
      505: "Nicaragua",
      353: "Ireland",
      298: "Faroe Islands",
      690: "Tokelau",
      992: "Tajikistan"
    }
  
    for(var cc in countries) {
  
      var reg = new RegExp("^" + cc)
  
      if(num.match(reg)) {
  
        return {code: cc, country: countries[cc]}
      }
    }
    console.log("Not Found")
    return false
  }

  */