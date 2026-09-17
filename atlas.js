/* the A-Z atlas: page scans georeferenced to the National Grid, a book that turns, and pins.
   Lifted from the atlas prototype; pages come from venues.jackhygate.co.uk/atlas/. */
window.createAtlas = function(root, opts) {
  'use strict';
  const IMAGES = opts.images.replace(/\/$/, '') + '/';
  const $ = s => root.querySelector(s);
const PAGES = {"4":{"f":7,"w":860,"h":1332,"T":321.01,"E":523.245,"N":198.3073,"half":0,"src":"mg"},"5":{"f":8,"w":860,"h":1332,"T":322.04,"E":526.0528,"N":198.3403,"half":1,"src":"gg"},"6":{"f":9,"w":860,"h":1332,"T":319.89,"E":528.2136,"N":198.3224,"half":0,"src":"gg"},"7":{"f":10,"w":860,"h":1332,"T":322.25,"E":531.0116,"N":198.3018,"half":1,"src":"gg"},"8":{"f":11,"w":860,"h":1332,"T":321.62,"E":533.3069,"N":198.3313,"half":0,"src":"gg"},"9":{"f":12,"w":860,"h":1332,"T":322.31,"E":536.04,"N":198.3197,"half":1,"src":"mm"},"10":{"f":13,"w":860,"h":1332,"T":321.46,"E":513.27,"N":194.8197,"half":0,"src":"gm"},"11":{"f":14,"w":860,"h":1332,"T":322.25,"E":516.0303,"N":194.8197,"half":1,"src":"gm"},"12":{"f":15,"w":860,"h":1332,"T":325.49,"E":518.3095,"N":194.918,"half":0,"src":"gg"},"13":{"f":16,"w":860,"h":1332,"T":326.62,"E":521.085,"N":194.8132,"half":1,"src":"mg"},"14":{"f":17,"w":860,"h":1332,"T":320.86,"E":523.2637,"N":194.8022,"half":0,"src":"gg"},"15":{"f":18,"w":860,"h":1332,"T":321.83,"E":526.0833,"N":194.8452,"half":1,"src":"gg"},"16":{"f":19,"w":860,"h":1332,"T":322.48,"E":528.27,"N":194.8197,"half":0,"src":"gm"},"17":{"f":20,"w":860,"h":1332,"T":327.78,"E":531.1465,"N":194.8505,"half":1,"src":"gg"},"18":{"f":21,"w":846,"h":1349,"T":325.02,"E":533.2632,"N":194.8197,"half":0,"src":"gm"},"19":{"f":22,"w":846,"h":1349,"T":320.87,"E":536.1199,"N":194.8122,"half":1,"src":"gg"},"20":{"f":23,"w":846,"h":1349,"T":321.92,"E":538.2864,"N":194.7928,"half":0,"src":"gg"},"21":{"f":24,"w":846,"h":1349,"T":323.04,"E":541.1473,"N":194.8313,"half":1,"src":"gg"},"22":{"f":25,"w":846,"h":1349,"T":328.5,"E":505.7915,"N":191.3197,"half":0,"src":"gm"},"23":{"f":26,"w":846,"h":1349,"T":322.5,"E":508.5836,"N":191.2968,"half":1,"src":"gg"},"24":{"f":27,"w":846,"h":1349,"T":321.63,"E":510.805,"N":191.3204,"half":0,"src":"mg"},"25":{"f":28,"w":846,"h":1349,"T":326.06,"E":513.6366,"N":191.3002,"half":1,"src":"gg"},"26":{"f":29,"w":846,"h":1349,"T":322.25,"E":515.7634,"N":191.2979,"half":0,"src":"gg"},"27":{"f":30,"w":846,"h":1349,"T":322.17,"E":518.5836,"N":191.3105,"half":1,"src":"gg"},"28":{"f":31,"w":846,"h":1349,"T":322.53,"E":520.8365,"N":191.3197,"half":0,"src":"gm"},"29":{"f":32,"w":846,"h":1349,"T":322.31,"E":523.6517,"N":191.3079,"half":1,"src":"gg"},"30":{"f":33,"w":846,"h":1349,"T":322.85,"E":525.7668,"N":191.3111,"half":0,"src":"gg"},"31":{"f":34,"w":846,"h":1349,"T":323.19,"E":528.6,"N":191.3289,"half":1,"src":"mg"},"32":{"f":35,"w":846,"h":1349,"T":323.24,"E":530.7916,"N":191.3498,"half":0,"src":"gg"},"33":{"f":36,"w":846,"h":1349,"T":322.52,"E":533.6517,"N":191.3085,"half":1,"src":"gg"},"34":{"f":37,"w":846,"h":1349,"T":323.14,"E":535.8091,"N":191.3238,"half":0,"src":"gg"},"35":{"f":38,"w":846,"h":1349,"T":322.76,"E":538.6,"N":191.3192,"half":1,"src":"mg"},"36":{"f":39,"w":846,"h":1349,"T":321.26,"E":540.7592,"N":191.3085,"half":0,"src":"gg"},"37":{"f":40,"w":846,"h":1349,"T":322.95,"E":543.5819,"N":191.3119,"half":1,"src":"gg"},"38":{"f":41,"w":846,"h":1349,"T":322.31,"E":545.805,"N":191.3197,"half":0,"src":"mm"},"39":{"f":42,"w":846,"h":1349,"T":321.78,"E":548.5618,"N":191.2904,"half":1,"src":"gg"},"40":{"f":43,"w":846,"h":1349,"T":323.75,"E":505.775,"N":187.8197,"half":0,"src":"mm"},"41":{"f":44,"w":846,"h":1349,"T":322.55,"E":508.6089,"N":187.8197,"half":1,"src":"gm"},"42":{"f":45,"w":846,"h":1349,"T":323.23,"E":510.749,"N":187.8197,"half":0,"src":"gm"},"43":{"f":46,"w":846,"h":1349,"T":322.4,"E":513.57,"N":187.8197,"half":1,"src":"mm"},"44":{"f":47,"w":846,"h":1349,"T":321.14,"E":515.775,"N":187.8134,"half":0,"src":"mg"},"45":{"f":48,"w":846,"h":1349,"T":321.92,"E":518.5761,"N":187.8197,"half":1,"src":"gm"},"46":{"f":49,"w":846,"h":1349,"T":317.74,"E":520.7431,"N":187.8197,"half":0,"src":"gm"},"47":{"f":50,"w":846,"h":1349,"T":320.69,"E":523.57,"N":187.8628,"half":1,"src":"mg"},"48":{"f":51,"w":846,"h":1349,"T":321.8,"E":525.775,"N":187.7416,"half":0,"src":"mg"},"49":{"f":52,"w":846,"h":1349,"T":322.03,"E":528.6121,"N":187.8725,"half":1,"src":"gg"},"50":{"f":53,"w":846,"h":1349,"T":321.58,"E":530.775,"N":187.8246,"half":0,"src":"mg"},"51":{"f":54,"w":846,"h":1349,"T":325.7,"E":533.6458,"N":187.862,"half":1,"src":"gg"},"52":{"f":55,"w":846,"h":1349,"T":324.4,"E":535.7683,"N":187.8197,"half":0,"src":"gm"},"53":{"f":56,"w":846,"h":1349,"T":321.84,"E":538.57,"N":187.8197,"half":1,"src":"mm"},"54":{"f":57,"w":846,"h":1349,"T":321.54,"E":540.7703,"N":187.8452,"half":0,"src":"gg"},"55":{"f":58,"w":846,"h":1349,"T":321.34,"E":543.57,"N":187.8114,"half":1,"src":"mg"},"56":{"f":59,"w":860,"h":1346,"T":321.48,"E":545.8045,"N":187.7646,"half":0,"src":"gg"},"57":{"f":60,"w":860,"h":1346,"T":323.88,"E":548.5707,"N":187.8197,"half":1,"src":"gm"},"58":{"f":61,"w":860,"h":1346,"T":325.63,"E":505.805,"N":184.2932,"half":0,"src":"mg"},"59":{"f":62,"w":860,"h":1346,"T":322.0,"E":508.5679,"N":184.3054,"half":1,"src":"gg"},"60":{"f":63,"w":860,"h":1346,"T":323.09,"E":510.7502,"N":184.2932,"half":0,"src":"gg"},"61":{"f":64,"w":860,"h":1346,"T":322.63,"E":513.5898,"N":184.2925,"half":1,"src":"gg"},"62":{"f":65,"w":860,"h":1346,"T":322.25,"E":515.7983,"N":184.277,"half":0,"src":"gg"},"63":{"f":66,"w":860,"h":1346,"T":325.52,"E":518.5973,"N":184.2968,"half":1,"src":"gg"},"64":{"f":67,"w":860,"h":1346,"T":321.25,"E":520.8062,"N":184.3197,"half":0,"src":"gm"},"65":{"f":68,"w":860,"h":1346,"T":323.49,"E":523.5971,"N":184.3382,"half":1,"src":"gg"},"66":{"f":69,"w":860,"h":1346,"T":321.42,"E":525.805,"N":184.3315,"half":0,"src":"mg"},"67":{"f":70,"w":860,"h":1346,"T":322.33,"E":528.6207,"N":184.3103,"half":1,"src":"gg"},"68":{"f":71,"w":860,"h":1346,"T":321.64,"E":530.7786,"N":184.3404,"half":0,"src":"gg"},"69":{"f":72,"w":860,"h":1346,"T":322.62,"E":533.6032,"N":184.1947,"half":1,"src":"gg"},"70":{"f":73,"w":860,"h":1346,"T":321.66,"E":535.791,"N":184.3128,"half":0,"src":"gg"},"71":{"f":74,"w":860,"h":1346,"T":324.11,"E":538.6,"N":184.3528,"half":1,"src":"mg"},"72":{"f":75,"w":860,"h":1346,"T":321.24,"E":540.805,"N":184.3424,"half":0,"src":"mg"},"73":{"f":76,"w":860,"h":1346,"T":326.98,"E":543.6464,"N":184.3097,"half":1,"src":"gg"},"74":{"f":77,"w":860,"h":1346,"T":326.52,"E":545.78,"N":184.3295,"half":0,"src":"gg"},"75":{"f":78,"w":860,"h":1346,"T":323.25,"E":548.5576,"N":184.3197,"half":1,"src":"gm"},"76":{"f":79,"w":860,"h":1346,"T":321.8,"E":505.8017,"N":180.834,"half":0,"src":"gg"},"77":{"f":80,"w":860,"h":1346,"T":324.29,"E":508.51,"N":180.8197,"half":1,"src":"gm"},"78":{"f":81,"w":860,"h":1346,"T":323.58,"E":510.8207,"N":180.8424,"half":0,"src":"gg"},"79":{"f":82,"w":860,"h":1346,"T":321.67,"E":513.545,"N":180.8197,"half":1,"src":"mm"},"80":{"f":83,"w":860,"h":1346,"T":322.0,"E":515.8296,"N":180.8197,"half":0,"src":"gm"},"81":{"f":84,"w":860,"h":1346,"T":323.04,"E":518.5206,"N":180.8197,"half":1,"src":"gm"},"82":{"f":85,"w":860,"h":1346,"T":323.28,"E":520.75,"N":180.7983,"half":0,"src":"mg"},"83":{"f":86,"w":860,"h":1346,"T":322.5,"E":523.5581,"N":180.8197,"half":1,"src":"gm"},"84":{"f":87,"w":860,"h":1346,"T":320.89,"E":525.75,"N":180.8026,"half":0,"src":"mg"},"85":{"f":88,"w":860,"h":1346,"T":320.92,"E":528.545,"N":180.8197,"half":1,"src":"mm"},"86":{"f":89,"w":860,"h":1346,"T":320.63,"E":530.75,"N":180.8197,"half":0,"src":"mm"},"87":{"f":90,"w":860,"h":1346,"T":321.86,"E":533.545,"N":180.8197,"half":1,"src":"mm"},"88":{"f":91,"w":860,"h":1346,"T":320.29,"E":535.8044,"N":180.8333,"half":0,"src":"gg"},"89":{"f":92,"w":860,"h":1346,"T":321.46,"E":538.6014,"N":180.8641,"half":1,"src":"gg"},"90":{"f":93,"w":860,"h":1346,"T":322.78,"E":540.7735,"N":180.8439,"half":0,"src":"gg"},"91":{"f":94,"w":860,"h":1346,"T":323.13,"E":543.6005,"N":180.8197,"half":1,"src":"gm"},"92":{"f":95,"w":860,"h":1346,"T":327.07,"E":545.7838,"N":180.8542,"half":0,"src":"gg"},"93":{"f":96,"w":860,"h":1346,"T":319.66,"E":548.5325,"N":180.8237,"half":1,"src":"gg"},"94":{"f":97,"w":860,"h":1346,"T":322.31,"E":505.78,"N":177.3197,"half":0,"src":"mm"},"95":{"f":98,"w":860,"h":1346,"T":319.79,"E":508.5955,"N":177.3023,"half":1,"src":"gg"},"96":{"f":99,"w":860,"h":1346,"T":322.25,"E":510.7968,"N":177.3197,"half":0,"src":"gm"},"97":{"f":100,"w":860,"h":1346,"T":323.22,"E":513.551,"N":177.3111,"half":1,"src":"gg"},"98":{"f":101,"w":860,"h":1346,"T":321.59,"E":515.7735,"N":177.3349,"half":0,"src":"gg"},"99":{"f":102,"w":860,"h":1346,"T":322.3,"E":518.5352,"N":177.3087,"half":1,"src":"gg"},"100":{"f":103,"w":860,"h":1346,"T":322.51,"E":520.78,"N":177.3197,"half":0,"src":"mm"},"101":{"f":104,"w":860,"h":1346,"T":322.48,"E":523.552,"N":177.3131,"half":1,"src":"gg"},"102":{"f":105,"w":860,"h":1346,"T":321.86,"E":525.813,"N":177.3414,"half":0,"src":"gg"},"103":{"f":106,"w":860,"h":1346,"T":323.76,"E":528.5652,"N":177.3434,"half":1,"src":"gg"},"104":{"f":107,"w":860,"h":1346,"T":322.51,"E":530.8234,"N":177.3197,"half":0,"src":"gm"},"105":{"f":108,"w":860,"h":1346,"T":321.25,"E":533.575,"N":177.3056,"half":1,"src":"mg"},"106":{"f":109,"w":860,"h":1346,"T":321.85,"E":535.78,"N":177.3414,"half":0,"src":"mg"},"107":{"f":110,"w":860,"h":1346,"T":321.64,"E":538.5244,"N":177.5374,"half":1,"src":"gg"},"108":{"f":111,"w":860,"h":1346,"T":321.62,"E":540.8462,"N":177.312,"half":0,"src":"gg"},"109":{"f":112,"w":860,"h":1346,"T":324.97,"E":543.6026,"N":177.345,"half":1,"src":"gg"},"110":{"f":113,"w":860,"h":1346,"T":326.76,"E":545.8415,"N":177.2694,"half":0,"src":"gg"},"111":{"f":114,"w":860,"h":1346,"T":320.23,"E":548.4925,"N":177.3018,"half":1,"src":"gg"},"112":{"f":115,"w":860,"h":1346,"T":322.82,"E":505.795,"N":173.8197,"half":0,"src":"mm"},"113":{"f":116,"w":860,"h":1346,"T":324.27,"E":508.59,"N":173.8197,"half":1,"src":"mm"},"114":{"f":117,"w":860,"h":1346,"T":320.14,"E":510.795,"N":173.8197,"half":0,"src":"mm"},"115":{"f":118,"w":860,"h":1346,"T":321.92,"E":513.5243,"N":173.8197,"half":1,"src":"gm"},"116":{"f":119,"w":860,"h":1346,"T":322.49,"E":515.8586,"N":173.8197,"half":0,"src":"gm"},"117":{"f":120,"w":860,"h":1346,"T":323.81,"E":518.59,"N":173.8631,"half":1,"src":"mg"},"118":{"f":121,"w":860,"h":1346,"T":322.61,"E":520.8415,"N":173.8207,"half":0,"src":"gg"},"119":{"f":122,"w":860,"h":1346,"T":322.53,"E":523.5562,"N":173.8197,"half":1,"src":"gm"},"120":{"f":123,"w":860,"h":1346,"T":321.59,"E":525.8234,"N":173.8089,"half":0,"src":"gg"},"121":{"f":124,"w":860,"h":1346,"T":322.63,"E":528.59,"N":173.8197,"half":1,"src":"mm"},"122":{"f":125,"w":860,"h":1346,"T":319.2,"E":530.8452,"N":173.8023,"half":0,"src":"gg"},"123":{"f":126,"w":860,"h":1346,"T":321.15,"E":533.5314,"N":173.8197,"half":1,"src":"gm"},"124":{"f":127,"w":860,"h":1346,"T":322.25,"E":535.7735,"N":173.8197,"half":0,"src":"gm"},"125":{"f":128,"w":860,"h":1346,"T":323.15,"E":538.5819,"N":173.8535,"half":1,"src":"gg"},"126":{"f":129,"w":860,"h":1346,"T":318.67,"E":540.7581,"N":173.8311,"half":0,"src":"gg"},"127":{"f":130,"w":860,"h":1346,"T":322.28,"E":543.59,"N":173.804,"half":1,"src":"mg"},"128":{"f":131,"w":860,"h":1346,"T":324.37,"E":545.8389,"N":173.8082,"half":0,"src":"gg"},"129":{"f":132,"w":860,"h":1346,"T":321.56,"E":548.5888,"N":173.8309,"half":1,"src":"gg"},"130":{"f":133,"w":860,"h":1346,"T":319.75,"E":505.78,"N":170.3354,"half":0,"src":"mg"},"131":{"f":134,"w":860,"h":1346,"T":322.25,"E":508.5578,"N":170.3018,"half":1,"src":"gg"},"132":{"f":135,"w":860,"h":1346,"T":318.24,"E":510.7621,"N":170.3011,"half":0,"src":"gg"},"133":{"f":136,"w":860,"h":1346,"T":326.11,"E":513.6014,"N":170.3085,"half":1,"src":"gg"},"134":{"f":137,"w":860,"h":1346,"T":321.67,"E":515.8299,"N":170.3344,"half":0,"src":"gg"},"135":{"f":138,"w":860,"h":1346,"T":322.8,"E":518.5904,"N":170.3005,"half":1,"src":"gg"},"136":{"f":139,"w":860,"h":1346,"T":322.99,"E":520.7804,"N":170.3323,"half":0,"src":"gg"},"137":{"f":140,"w":860,"h":1346,"T":322.09,"E":523.5314,"N":170.3103,"half":1,"src":"gg"},"138":{"f":141,"w":860,"h":1346,"T":323.24,"E":525.628,"N":170.2968,"half":0,"src":"gg"},"139":{"f":142,"w":860,"h":1346,"T":321.85,"E":528.575,"N":170.3064,"half":1,"src":"mg"},"140":{"f":143,"w":867,"h":1356,"T":321.27,"E":530.8061,"N":170.3197,"half":0,"src":"gm"},"141":{"f":144,"w":867,"h":1356,"T":323.9,"E":533.519,"N":170.3474,"half":1,"src":"gg"},"142":{"f":145,"w":867,"h":1356,"T":319.06,"E":535.78,"N":170.313,"half":0,"src":"mg"},"143":{"f":146,"w":867,"h":1356,"T":321.86,"E":538.575,"N":170.3198,"half":1,"src":"mg"},"144":{"f":147,"w":867,"h":1356,"T":320.25,"E":540.78,"N":170.3123,"half":0,"src":"mg"},"145":{"f":148,"w":867,"h":1356,"T":322.52,"E":543.519,"N":170.3266,"half":1,"src":"gg"},"146":{"f":149,"w":867,"h":1356,"T":326.32,"E":515.7975,"N":166.8197,"half":0,"src":"gm"},"147":{"f":150,"w":867,"h":1356,"T":319.02,"E":518.605,"N":166.8197,"half":1,"src":"mm"},"148":{"f":151,"w":867,"h":1356,"T":323.96,"E":520.8324,"N":166.8197,"half":0,"src":"gm"},"149":{"f":152,"w":867,"h":1356,"T":322.25,"E":523.605,"N":166.8223,"half":1,"src":"mg"},"150":{"f":153,"w":867,"h":1356,"T":327.95,"E":525.8025,"N":166.7921,"half":0,"src":"gg"},"151":{"f":154,"w":867,"h":1356,"T":322.81,"E":528.5228,"N":166.8161,"half":1,"src":"gg"},"152":{"f":155,"w":867,"h":1356,"T":322.88,"E":530.81,"N":166.8197,"half":0,"src":"mm"},"153":{"f":156,"w":867,"h":1356,"T":324.99,"E":533.5493,"N":166.8197,"half":1,"src":"gm"},"154":{"f":157,"w":867,"h":1356,"T":324.27,"E":535.7735,"N":166.7985,"half":0,"src":"gg"},"155":{"f":158,"w":867,"h":1356,"T":320.65,"E":538.5151,"N":166.8197,"half":1,"src":"gm"},"156":{"f":159,"w":867,"h":1356,"T":324.16,"E":540.8104,"N":166.8197,"half":0,"src":"gm"}};     // atlas map page -> {f,w,h,T,E,N,half,src}
const DIM   = {"1":[874,1336],"2":[874,1336],"3":[856,1360],"4":[856,1360],"5":[860,1332],"6":[860,1332],"7":[860,1332],"8":[860,1332],"9":[860,1332],"10":[860,1332],"11":[860,1332],"12":[860,1332],"13":[860,1332],"14":[860,1332],"15":[860,1332],"16":[860,1332],"17":[860,1332],"18":[860,1332],"19":[860,1332],"20":[860,1332],"21":[846,1349],"22":[846,1349],"23":[846,1349],"24":[846,1349],"25":[846,1349],"26":[846,1349],"27":[846,1349],"28":[846,1349],"29":[846,1349],"30":[846,1349],"31":[846,1349],"32":[846,1349],"33":[846,1349],"34":[846,1349],"35":[846,1349],"36":[846,1349],"37":[846,1349],"38":[846,1349],"39":[846,1349],"40":[846,1349],"41":[846,1349],"42":[846,1349],"43":[846,1349],"44":[846,1349],"45":[846,1349],"46":[846,1349],"47":[846,1349],"48":[846,1349],"49":[846,1349],"50":[846,1349],"51":[846,1349],"52":[846,1349],"53":[846,1349],"54":[846,1349],"55":[846,1349],"56":[846,1349],"57":[846,1349],"58":[846,1349],"59":[860,1346],"60":[860,1346],"61":[860,1346],"62":[860,1346],"63":[860,1346],"64":[860,1346],"65":[860,1346],"66":[860,1346],"67":[860,1346],"68":[860,1346],"69":[860,1346],"70":[860,1346],"71":[860,1346],"72":[860,1346],"73":[860,1346],"74":[860,1346],"75":[860,1346],"76":[860,1346],"77":[860,1346],"78":[860,1346],"79":[860,1346],"80":[860,1346],"81":[860,1346],"82":[860,1346],"83":[860,1346],"84":[860,1346],"85":[860,1346],"86":[860,1346],"87":[860,1346],"88":[860,1346],"89":[860,1346],"90":[860,1346],"91":[860,1346],"92":[860,1346],"93":[860,1346],"94":[860,1346],"95":[860,1346],"96":[860,1346],"97":[860,1346],"98":[860,1346],"99":[860,1346],"100":[860,1346],"101":[860,1346],"102":[860,1346],"103":[860,1346],"104":[860,1346],"105":[860,1346],"106":[860,1346],"107":[860,1346],"108":[860,1346],"109":[860,1346],"110":[860,1346],"111":[860,1346],"112":[860,1346],"113":[860,1346],"114":[860,1346],"115":[860,1346],"116":[860,1346],"117":[860,1346],"118":[860,1346],"119":[860,1346],"120":[860,1346],"121":[860,1346],"122":[860,1346],"123":[860,1346],"124":[860,1346],"125":[860,1346],"126":[860,1346],"127":[860,1346],"128":[860,1346],"129":[860,1346],"130":[860,1346],"131":[860,1346],"132":[860,1346],"133":[860,1346],"134":[860,1346],"135":[860,1346],"136":[860,1346],"137":[860,1346],"138":[860,1346],"139":[860,1346],"140":[860,1346],"141":[860,1346],"142":[860,1346],"143":[867,1356],"144":[867,1356],"145":[867,1356],"146":[867,1356],"147":[867,1356],"148":[867,1356],"149":[867,1356],"150":[867,1356],"151":[867,1356],"152":[867,1356],"153":[867,1356],"154":[867,1356],"155":[867,1356],"156":[867,1356],"157":[867,1356],"158":[867,1356],"159":[867,1356],"160":[867,1356],"161":[867,1356],"162":[867,1356],"163":[867,1356],"164":[867,1356],"165":[867,1356],"166":[867,1356],"167":[867,1356],"168":[867,1356],"169":[867,1356],"170":[867,1356],"171":[867,1356],"172":[867,1356],"173":[867,1356],"174":[867,1356],"175":[867,1356],"176":[867,1356],"177":[843,1325],"178":[843,1325],"179":[849,1339],"180":[849,1339],"181":[849,1339],"182":[849,1339],"183":[860,1336],"184":[860,1336],"185":[860,1336],"186":[860,1336],"187":[860,1336],"188":[860,1336],"189":[860,1336],"190":[860,1336],"191":[860,1336],"192":[860,1336],"193":[860,1336],"194":[860,1336],"195":[860,1336],"196":[860,1336],"197":[860,1336],"198":[860,1336],"199":[860,1336],"200":[860,1336],"201":[860,1336],"202":[860,1336],"203":[860,1336],"204":[860,1336],"205":[860,1336],"206":[860,1336],"207":[860,1336],"208":[860,1336],"209":[860,1336],"210":[860,1336],"211":[860,1336],"212":[860,1336],"213":[860,1336],"214":[860,1336],"215":[860,1336],"216":[860,1336],"217":[860,1336],"218":[860,1336],"219":[860,1336],"220":[860,1336],"221":[860,1336],"222":[860,1336],"223":[860,1336],"224":[860,1336],"225":[860,1336],"226":[860,1336],"227":[860,1336],"228":[860,1336],"229":[860,1336],"230":[860,1336],"231":[860,1336],"232":[860,1336],"233":[860,1336],"234":[860,1336],"235":[860,1336],"236":[860,1336],"237":[860,1336],"238":[860,1336],"239":[860,1336],"240":[860,1336],"241":[860,1336],"242":[860,1336],"243":[860,1336],"244":[860,1336],"245":[860,1336],"246":[860,1336],"247":[860,1336],"248":[860,1336],"249":[860,1336],"250":[860,1336],"251":[860,1336],"252":[860,1336],"253":[860,1336],"254":[860,1336],"255":[860,1336],"256":[860,1336],"257":[860,1336],"258":[860,1336],"259":[860,1336],"260":[860,1336],"261":[860,1336],"262":[860,1336],"263":[860,1336],"264":[860,1336],"265":[860,1336],"266":[860,1336],"267":[860,1336],"268":[860,1336],"269":[860,1336],"270":[860,1336],"271":[860,1336],"272":[860,1336],"273":[860,1336],"274":[860,1336],"275":[860,1336],"276":[860,1336],"277":[860,1336],"278":[860,1336],"279":[860,1336],"280":[860,1336],"281":[860,1336],"282":[860,1336],"283":[860,1336],"284":[860,1336],"285":[860,1336],"286":[860,1336],"287":[860,1336],"288":[860,1336],"289":[860,1336],"290":[860,1336],"291":[860,1336],"292":[860,1336],"293":[860,1336],"294":[860,1336],"295":[860,1336],"296":[860,1336],"297":[860,1336],"298":[860,1336],"299":[860,1336],"300":[860,1336],"301":[860,1336],"302":[860,1336],"303":[860,1336],"304":[860,1336],"305":[860,1336],"306":[860,1336],"307":[860,1336],"308":[860,1336],"309":[860,1336],"310":[860,1336],"311":[860,1336],"312":[860,1336],"313":[860,1336],"314":[860,1336],"315":[860,1336],"316":[860,1336],"317":[860,1336],"318":[860,1336],"319":[860,1336],"320":[860,1336],"321":[860,1336],"322":[860,1336],"323":[860,1336],"324":[860,1336],"325":[860,1336],"326":[860,1336],"327":[860,1336],"328":[860,1336],"329":[860,1336],"330":[860,1336],"331":[860,1336],"332":[860,1336],"333":[860,1336],"334":[860,1336],"335":[860,1336],"336":[860,1336],"337":[860,1336],"338":[860,1336],"339":[860,1336],"340":[860,1336],"341":[860,1336],"342":[860,1336],"343":[860,1336],"344":[860,1336],"345":[860,1336],"346":[860,1336],"347":[860,1336],"348":[860,1336],"349":[860,1336],"350":[860,1336],"351":[860,1336],"352":[860,1336],"353":[860,1336],"354":[860,1336],"355":[860,1336],"356":[860,1336],"357":[860,1336],"358":[860,1336],"359":[860,1336],"360":[860,1336],"361":[860,1336],"362":[860,1336],"363":[860,1336],"364":[860,1336],"365":[860,1336],"366":[860,1336],"367":[860,1336],"368":[860,1336],"369":[860,1336],"370":[860,1336],"371":[860,1336],"372":[860,1336],"373":[860,1336],"374":[860,1336],"375":[860,1336],"376":[860,1336],"377":[860,1336],"378":[860,1336],"379":[860,1336],"380":[860,1336],"381":[860,1336],"382":[860,1336],"383":[860,1336],"384":[860,1336],"385":[860,1336],"386":[860,1336],"387":[860,1336],"388":[874,1336]};      // file no -> [w,h]
const NFILES = 388, DUP = new Set([2,388]);   // 2 & 388 are duplicate photos of the cover
const PPK = 322;                  // reference pixels per km for spread layout
const FILE2PAGE = {}; for(const p in PAGES) FILE2PAGE[PAGES[p].f]=+p;


/* ---------- WGS84 <-> OSGB36 National Grid ---------- */
const D = Math.PI/180;
function helmert(x,y,z,p){
  const s=1+p.s*1e-6, rx=p.rx/3600*D, ry=p.ry/3600*D, rz=p.rz/3600*D;
  return [p.tx + x*s - y*rz + z*ry, p.ty + x*rz + y*s - z*rx, p.tz - x*ry + y*rx + z*s];
}
const TO_OSGB={tx:-446.448,ty:125.157,tz:-542.060,s:20.4894,rx:-0.1502,ry:-0.2470,rz:-0.8421};
const TO_WGS ={tx:446.448,ty:-125.157,tz:542.060,s:-20.4894,rx:0.1502,ry:0.2470,rz:0.8421};
const WGS={a:6378137.0,b:6356752.3142}, AIRY={a:6377563.396,b:6356256.909};
function geodToCart(lat,lon,el){
  const a=el.a,b=el.b,e2=1-(b*b)/(a*a),p=lat*D,l=lon*D;
  const nu=a/Math.sqrt(1-e2*Math.sin(p)**2);
  return [nu*Math.cos(p)*Math.cos(l), nu*Math.cos(p)*Math.sin(l), (1-e2)*nu*Math.sin(p)];
}
function cartToGeod(x,y,z,el){
  const a=el.a,b=el.b,e2=1-(b*b)/(a*a),p0=Math.sqrt(x*x+y*y);
  let lat=Math.atan2(z,p0*(1-e2)),old=1e9;
  while(Math.abs(lat-old)>1e-14){old=lat;const nu=a/Math.sqrt(1-e2*Math.sin(lat)**2);
    lat=Math.atan2(z+e2*nu*Math.sin(lat),p0);}
  return [lat/D, Math.atan2(y,x)/D];
}
const TM={F0:0.9996012717,lat0:49*D,lon0:-2*D,E0:400000,N0:-100000};
function toGrid(lat,lon){
  const a=AIRY.a,b=AIRY.b,e2=1-(b*b)/(a*a),n=(a-b)/(a+b);
  const p=lat*D,l=lon*D,{F0,lat0,lon0,E0,N0}=TM;
  const nu=a*F0/Math.sqrt(1-e2*Math.sin(p)**2);
  const rho=a*F0*(1-e2)/Math.pow(1-e2*Math.sin(p)**2,1.5);
  const eta2=nu/rho-1, dl=p-lat0, sl=p+lat0, t=Math.tan(p), c=Math.cos(p), s=Math.sin(p);
  const M=b*F0*((1+n+1.25*n*n+1.25*n**3)*dl
    -(3*n+3*n*n+2.625*n**3)*Math.sin(dl)*Math.cos(sl)
    +(1.875*n*n+1.875*n**3)*Math.sin(2*dl)*Math.cos(2*sl)
    -(35/24)*n**3*Math.sin(3*dl)*Math.cos(3*sl));
  const I=M+N0, II=nu/2*s*c, III=nu/24*s*c**3*(5-t*t+9*eta2),
        IIIA=nu/720*s*c**5*(61-58*t*t+t**4), IV=nu*c, V=nu/6*c**3*(nu/rho-t*t),
        VI=nu/120*c**5*(5-18*t*t+t**4+14*eta2-58*t*t*eta2);
  const d=l-lon0;
  return [E0+IV*d+V*d**3+VI*d**5, I+II*d*d+III*d**4+IIIA*d**6];
}
function fromGrid(E,N){
  const a=AIRY.a,b=AIRY.b,e2=1-(b*b)/(a*a),n=(a-b)/(a+b),{F0,lat0,lon0,E0,N0}=TM;
  let p=lat0,M=0;
  do{ p=(N-N0-M)/(a*F0)+p;
      const dl=p-lat0,sl=p+lat0;
      M=b*F0*((1+n+1.25*n*n+1.25*n**3)*dl
        -(3*n+3*n*n+2.625*n**3)*Math.sin(dl)*Math.cos(sl)
        +(1.875*n*n+1.875*n**3)*Math.sin(2*dl)*Math.cos(2*sl)
        -(35/24)*n**3*Math.sin(3*dl)*Math.cos(3*sl));
  } while(Math.abs(N-N0-M)>1e-5);
  const nu=a*F0/Math.sqrt(1-e2*Math.sin(p)**2);
  const rho=a*F0*(1-e2)/Math.pow(1-e2*Math.sin(p)**2,1.5), eta2=nu/rho-1;
  const t=Math.tan(p),sec=1/Math.cos(p),dE=E-E0;
  const VII=t/(2*rho*nu), VIII=t/(24*rho*nu**3)*(5+3*t*t+eta2-9*t*t*eta2),
        IX=t/(720*rho*nu**5)*(61+90*t*t+45*t**4),
        X=sec/nu, XI=sec/(6*nu**3)*(nu/rho+2*t*t),
        XII=sec/(120*nu**5)*(5+28*t*t+24*t**4),
        XIIA=sec/(5040*nu**7)*(61+662*t*t+1320*t**4+720*t**6);
  return [(p-VII*dE**2+VIII*dE**4-IX*dE**6)/D, (lon0+X*dE-XI*dE**3+XII*dE**5-XIIA*dE**7)/D];
}
function wgsToEN(lat,lon){
  const [x,y,z]=geodToCart(lat,lon,WGS), [x2,y2,z2]=helmert(x,y,z,TO_OSGB);
  const [la,lo]=cartToGeod(x2,y2,z2,AIRY);
  return toGrid(la,lo);
}
function enToWgs(E,N){
  const [la,lo]=fromGrid(E,N);
  const [x,y,z]=geodToCart(la,lo,AIRY), [x2,y2,z2]=helmert(x,y,z,TO_WGS);
  return cartToGeod(x2,y2,z2,WGS);
}

/* ---------- pages, spreads, layout ---------- */
function ext(p){const g=PAGES[p];return {l:g.E, r:g.E+g.w/g.T, t:g.N, b:g.N-g.h/g.T};}
function fileUrl(f){return IMAGES+"A-Z%20London_page_"+String(f).padStart(3,'0')+".jpg";}
function spreadOfFile(f){ return f<=2 ? 0 : Math.floor((f-1)/2); }
function spreadOfPage(p){ return spreadOfFile(PAGES[p].f); }
function filesOf(s){
  if(s<=0) return [null,1];
  const a=2*s+1, b=2*s+2;
  return [a<=NFILES&&!DUP.has(a)?a:null, b<=NFILES&&!DUP.has(b)?b:null];
}
const MAXS = spreadOfFile(387);

/* layout(s) -> {w,h,spineX,halves:[{file,page,x,y,w,h}],geo:{E0,N0}|null} */
const layoutCache = new Map();
function layout(s){
  if(layoutCache.has(s)) return layoutCache.get(s);
  const [fa,fb]=filesOf(s);
  const ga=fa&&FILE2PAGE[fa]!==undefined?PAGES[FILE2PAGE[fa]]:null;
  const gb=fb&&FILE2PAGE[fb]!==undefined?PAGES[FILE2PAGE[fb]]:null;
  let L;
  if(ga||gb){
    // laid out like the paper book: left page at the origin, right page flush against it,
    // both tops level. Each half keeps its own georeference, so spreads never jolt between turns.
    const geos=[[fa,ga],[fb,gb]].filter(x=>x[1]).sort((p,q)=>p[1].E-q[1].E);
    const halves=[]; let x=0;
    for(const [f,g] of geos){ const w=g.w/g.T*PPK, h=g.h/g.T*PPK; halves.push({file:f,page:FILE2PAGE[f],x,y:0,w,h,E:g.E,N:g.N}); x+=w; }
    let W=x, H=Math.max(...halves.map(q=>q.h));
    for(const [f,g] of [[fa,ga],[fb,gb]]){        // a facing page without georeference (the super-scale key by 156)
      if(g||!f) continue;
      const d=DIM[f], sc=H/d[1], w=d[0]*sc;
      if(f===fa){ halves.forEach(q=>q.x+=w); halves.unshift({file:f,page:null,x:0,y:0,w,h:H}); }
      else halves.push({file:f,page:null,x:W,y:0,w,h:H});
      W+=w;
    }
    const spineX = halves.length>1 ? halves[1].x : halves[0].w;
    L={w:W,h:H,spineX,halves,geo:true};
  } else {
    const items=[fa,fb].filter(Boolean).map(f=>({file:f,d:DIM[f]}));
    const H=Math.max(...items.map(i=>i.d[1]));
    let x=0; const halves=[];
    for(const i of items){
      const sc=H/i.d[1], w=i.d[0]*sc;
      halves.push({file:i.file,page:FILE2PAGE[i.file]??null,x,y:0,w,h:H}); x+=w;
    }
    // single sheets (the cover) sit on the right, like a recto
    let spineX = halves.length>1 ? halves[1].x : 0;
    if(halves.length===1 && s===0){ spineX=0; }
    L={w:x,h:H,spineX,halves,geo:null};
  }
  layoutCache.set(s,L); return L;
}
function halfOfPage(s,p){ return layout(s).halves.find(q=>q.page===p); }
function geoHalves(L){ return L.halves.filter(q=>q.page); }
function spreadPx(s,Ek,Nk){                       // km -> spread px, via whichever page the point falls on
  const L=layout(s); if(!L.geo) return null;
  const hs=geoHalves(L); let h=hs.find(q=>Ek>=q.E&&Ek<=q.E+q.w/PPK) || hs.reduce((b,q)=>Math.abs(Ek-(q.E+q.w/PPK/2))<Math.abs(Ek-(b.E+b.w/PPK/2))?q:b);
  return {x:h.x+(Ek-h.E)*PPK, y:h.y+(h.N-Nk)*PPK};
}
function spreadKm(s,x,y){                         // spread px -> km
  const L=layout(s); if(!L.geo) return null;
  const hs=geoHalves(L); const h=hs.find(q=>x>=q.x&&x<=q.x+q.w) || (x<L.spineX?hs[0]:hs[hs.length-1]);
  return {Ek:h.E+(x-h.x)/PPK, Nk:h.N-(y-h.y)/PPK};
}
function pagesAt(Ek,Nk){
  const hits=[];
  for(const p in PAGES){const e=ext(p);
    if(Ek>=e.l&&Ek<=e.r&&Nk<=e.t&&Nk>=e.b)
      hits.push({p:+p,m:Math.min(Ek-e.l,e.r-Ek,Nk-e.b,e.t-Nk)});}
  hits.sort((a,b)=>b.m-a.m);
  return hits;
}
/* A-Z lettered squares: 0.5 km, anchored per page half */
function gridRef(p,x,y){
  const g=PAGES[p], xk=x/g.T, yk=y/g.T;
  const anchor = g.half ? 0.170 : 0.487;
  const col=Math.floor((xk-anchor+0.25)/0.5), row=Math.floor((yk-0.559+0.25)/0.5);
  if(col<0||col>4||row<0||row>6) return null;
  return (row+1)+(g.half?"FGHJK":"ABCDE")[col];
}
function neighbourPage(p,dir){
  const e=ext(p), cE=(e.l+e.r)/2, cN=(e.t+e.b)/2, w=e.r-e.l, h=e.t-e.b;
  const tE=cE+(dir==='e'?w*0.8:dir==='w'?-w*0.8:0), tN=cN+(dir==='n'?h*0.8:dir==='s'?-h*0.8:0);
  let best=null;
  for(const q in PAGES){ if(+q===p) continue;
    const f=ext(q), d=Math.hypot((f.l+f.r)/2-tE,(f.t+f.b)/2-tN);
    if(!best||d<best.d) best={q:+q,d};
  }
  if(!best) return null;
  const f=ext(best.q);
  const ok = dir==='e'? f.l>e.l+w*0.3 : dir==='w'? f.l<e.l-w*0.3
           : dir==='n'? f.t>e.t+h*0.3 : f.t<e.t-h*0.3;
  return ok?best.q:null;
}


/* the 'Key to map pages' spread (files 5–6): the whole of London, every page a numbered box.
   Affine from km to spread pixels, fitted to the printed grid (rms ≈ 6 px). */
const KEY_S = spreadOfFile(5);
const KEY_AFF = {ax:[31.43013,-0.06712,-15731.59506], ay:[0.03223,-32.07847,6438.11423]};
function keyPx(Ek,Nk){const [a,b,c]=KEY_AFF.ax,[d,e,f]=KEY_AFF.ay; return {x:a*Ek+b*Nk+c, y:d*Ek+e*Nk+f};}
function keyKm(x,y){const [a,b,c]=KEY_AFF.ax,[d,e,f]=KEY_AFF.ay, det=a*e-b*d, X=x-c, Y=y-f; return {Ek:(e*X-b*Y)/det, Nk:(a*Y-d*X)/det};}

/* ---------- state ---------- */
root.innerHTML=`<div class="at-book-wrap"><div class="at-viewport"><div class="at-box"><div class="at-bookel"><div class="at-sheet"></div><div class="at-overlay"></div><div class="at-turn"></div></div></div></div>
    <div class="at-flip"><button class="at-prev" aria-label="previous page">‹</button><span class="at-label">—</span><button class="at-next" aria-label="next page">›</button></div>
    <button class="at-whole" title="the whole of London">all of london</button></div>
  <aside class="at-key"><h3>Key <span class="at-count"></span></h3><div class="at-cats"></div><div class="at-index"></div>
    <div class="at-pager"><button class="at-pprev" aria-label="previous page of the key">‹</button><span class="at-pnum"></span><button class="at-pnext" aria-label="next page of the key">›</button></div></aside>
  <div class="at-cards"></div>`;
const vp=$('.at-viewport'), box=$('.at-box'), book=$('.at-bookel'), sheet=$('.at-sheet'), ov=$('.at-overlay'), turnLayer=$('.at-turn');
let curS=null, zoom=null, target=null, probe=null;
/* ---------- rendering ---------- */
function halfImg(q,cls){
  const im=document.createElement('img');
  im.className='at-half'+(cls?' '+cls:''); im.src=fileUrl(q.file); im.alt="";
  im.style.left=q.x+'px'; im.style.top=q.y+'px';
  im.style.width=q.w+'px'; im.style.height=q.h+'px';
  im.draggable=false;
  return im;
}
function renderSpread(s){
  const L=layout(s);
  sheet.innerHTML='';
  for(const q of L.halves) sheet.appendChild(halfImg(q));
  if(L.halves.length>1){
    const g=document.createElement('div'); g.className='at-gutter';
    const gw=Math.max(22,(L.halves[1].x-(L.halves[0].x+L.halves[0].w))+22);
    g.style.left=(L.spineX-gw/2)+'px'; g.style.top='0'; g.style.width=gw+'px';
    g.style.height=L.h+'px';
    sheet.appendChild(g);
  }
  book.style.width=L.w+'px'; book.style.height=L.h+'px';
  ov.style.width=L.w+'px'; ov.style.height=L.h+'px';
  turnLayer.style.width=L.w+'px'; turnLayer.style.height=L.h+'px';
  applyZoom(false);
  drawOverlay(); describe();
}
function fitZoom(){
  const L=layout(curS);
  return Math.min((vp.clientWidth-40)/L.w, (vp.clientHeight-40)/L.h);
}
function applyZoom(keepCentre){
  const L=layout(curS), prev=book._z||fitZoom();
  const cx=(vp.scrollLeft+vp.clientWidth/2)/prev, cy=(vp.scrollTop+vp.clientHeight/2)/prev;
  const z=zoom===null?fitZoom():zoom;
  book._z=z;
  book.style.transform=`scale(${z})`;
  box.style.width=(L.w*z)+'px'; box.style.height=(L.h*z)+'px';
  book.style.perspective=(L.w*1.7)+'px';
  ov.querySelectorAll('.at-pin,.at-vpin').forEach(el=>el.style.transform=`translate(-50%,-100%) scale(${1/z})`);
  ov.querySelectorAll('.at-dot').forEach(el=>el.style.transform=`translate(-50%,-50%) scale(${1/z})`);
  ov.querySelectorAll('.at-probe').forEach(el=>el.style.transform=`translate(-50%,-50%) scale(${1/z})`);
  if(keepCentre){ vp.scrollLeft=cx*z-vp.clientWidth/2; vp.scrollTop=cy*z-vp.clientHeight/2; }
}
const PIN=`<svg width="26" height="34" viewBox="0 0 26 34"><path d="M13 33C13 33 25 19.5 25 12.2 25 5.5 19.6 0 13 0S1 5.5 1 12.2C1 19.5 13 33 13 33z" fill="#ff3b30" stroke="#fff" stroke-width="1.6"/><circle cx="13" cy="12" r="4.2" fill="#fff"/></svg>`;
const PROBE=`<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="6" fill="none" stroke="#4da3ff" stroke-width="2"/><circle cx="11" cy="11" r="1.6" fill="#4da3ff"/></svg>`;

function drawOverlay(){
  ov.innerHTML='';
  const L=layout(curS), z=book._z||1;
  if(false){
    const {E0,N0}=L.geo; let lines='',labels='';
    for(let E=Math.ceil(E0);E<=E0+L.w/PPK;E++){const x=(E-E0)*PPK;
      lines+=`<line x1="${x}" y1="0" x2="${x}" y2="${L.h}" vector-effect="non-scaling-stroke"/>`;
      labels+=`<text x="${x+5/z}" y="${18/z}">${E%1000}</text>`;}
    for(let N=Math.floor(N0);N>=N0-L.h/PPK;N--){const y=(N0-N)*PPK;
      lines+=`<line x1="0" y1="${y}" x2="${L.w}" y2="${y}" vector-effect="non-scaling-stroke"/>`;
      labels+=`<text x="${5/z}" y="${y-6/z}">${N%1000}</text>`;}
    ov.insertAdjacentHTML('beforeend',
      `<svg viewBox="0 0 ${L.w} ${L.h}" width="${L.w}" height="${L.h}" style="position:absolute;left:0;top:0">
        <g stroke="#00b0ff" stroke-width="1.3" opacity=".9" fill="none">${lines}</g>
        <g fill="#7ee3ff" font-family="ui-monospace,monospace" font-size="${12/z}"
           paint-order="stroke" stroke="#00151f" stroke-width="${3/z}">${labels}</g></svg>`);
  }
  if(false)
    for(const q of L.halves)
      ov.insertAdjacentHTML('beforeend',`<div style="position:absolute;left:${q.x}px;top:${q.y}px;
        width:${q.w}px;height:${q.h}px;border:${2/z}px dashed #ffd54f;opacity:.85"></div>`);
  if(target && curS===KEY_S){ /* the selected venue is the highlighted dot */ }
  else if(target && L.geo){
    const q=spreadPx(curS,target.Ek,target.Nk);
    if(q && q.x>=-40 && q.y>=-40 && q.x<=L.w+40 && q.y<=L.h+40)
      ov.insertAdjacentHTML('beforeend',
        `<div class="at-pin" style="left:${q.x}px;top:${q.y}px;transform:translate(-50%,-100%) scale(${1/z})">${PIN}</div>`);
  }
  if(curS===KEY_S) for(const v of VENUES){
    if(!v.geo || !passes(v)) continue;
    const q=keyPx(v.Ek,v.Nk); if(q.x<0||q.y<0||q.x>L.w||q.y>L.h) continue;
    ov.insertAdjacentHTML('beforeend',
      `<div class="at-dot${selected===v.id?' cur':''}" data-v="${v.id}" style="left:${q.x}px;top:${q.y}px;--c:${catColour(v.category)};transform:translate(-50%,-50%) scale(${1/z})"><div class="l">${esc(v.name)}</div></div>`);
  }
  if(L.geo) for(const v of VENUES){
    if(!v.geo || !passes(v)) continue;
    const q=spreadPx(curS,v.Ek,v.Nk);
    if(!q || q.x<-20 || q.y<-20 || q.x>L.w+20 || q.y>L.h+20) continue;
    if(selected===v.id) continue;                       // the selected venue gets the big pin via target
    ov.insertAdjacentHTML('beforeend',
      `<div class="at-vpin" data-v="${v.id}" style="left:${q.x}px;top:${q.y}px;--c:${catColour(v.category)};transform:translate(-50%,-100%) scale(${1/z})"><div class="m"></div><div class="l">${esc(v.name)}</div></div>`);
  }
  if(probe && probe.s===curS)
    ov.insertAdjacentHTML('beforeend',
      `<div class="at-probe" style="left:${probe.x}px;top:${probe.y}px;transform:translate(-50%,-50%) scale(${1/z})">${PROBE}</div>`);
}

const CAL={gg:"both axes locked to the printed National Grid",
  gm:"E locked to printed grid, N from the page model",
  mg:"N locked to printed grid, E from the page model",
  mm:"position from the page model (no grid lines detected)"};
const SECTIONS=[[1,1,"contents & reference"],[2,3,"key to map pages"],
  [157,157,"super scale key"],[158,173,"super scale central London"],
  [174,175,"railway connections"],[176,177,"West End cinemas & theatres"],
  [178,376,"street index"],[377,381,"hospitals & hospices index"],[382,384,"stations index"]];
function sectionName(a){ for(const [lo,hi,n] of SECTIONS) if(a>=lo&&a<=hi) return n; return null; }
function spreadLabel(s){
  if(s===0) return "front cover";
  const fs=layout(s).halves.map(q=>q.file);
  if(fs.includes(3)) return "inside front cover · contents";
  const at=fs.map(f=>f-3).filter(a=>a>=1);
  if(!at.length) return "file "+fs.join("–");
  const nums = at.length>1 ? at[0]+"–"+at[at.length-1] : String(at[0]);
  const name = sectionName(at[0]);
  return "pages "+nums+(name?" · "+name:"");
}
function describe(){
  const L=layout(curS), pgs=L.halves.filter(q=>q.page).map(q=>q.page);
  $('.at-label').textContent=curS===KEY_S?'all of london':spreadLabel(curS);
  $('.at-whole').hidden = curS===KEY_S;
  $('.at-prev').disabled = curS<=0; $('.at-next').disabled = curS>=MAXS;
  renderCards();
}
/* ---------- page turn ---------- */
const preloaded=new Set();
function preload(s){
  for(const q of layout(s).halves){
    if(preloaded.has(q.file)) continue;
    preloaded.add(q.file); const i=new Image(); i.src=fileUrl(q.file);
  }
}
function loadHalf(q){
  return new Promise(res=>{const i=new Image();
    i.onload=i.onerror=()=>res(); i.src=fileUrl(q.file);});
}
function faceEl(cls,img,rect,within){
  const f=document.createElement('div'); f.className='at-face '+cls;
  f.style.left='0'; f.style.top='0'; f.style.width=within.w+'px'; f.style.height=within.h+'px';
  const im=document.createElement('img');
  im.src=fileUrl(img.file); im.style.left=rect.x+'px'; im.style.top=rect.y+'px';
  im.style.width=rect.w+'px'; im.style.height=rect.h+'px'; im.draggable=false;
  f.appendChild(im);
  const sh=document.createElement('div'); sh.className='at-shade'; f.appendChild(sh);
  return f;
}
function settle(anim,ms){          // resolves on finish, cancel or timeout — never wedges
  return new Promise(res=>{ let done=false; const f=()=>{if(!done){done=true;res();}};
    anim.finished.then(f,f); setTimeout(f,ms+600); });
}
async function turnTo(ns,ms){
  const L=layout(curS), N=layout(ns), fwd=ns>curS;
  const cur=L.halves, nxt=N.halves;
  const curLeft = cur.length>1?cur[0]:(L.spineX>0?cur[0]:null);
  const curRight= cur.length>1?cur[1]:(L.spineX>0?null:cur[0]);
  const nLeft = nxt.length>1?nxt[0]:(N.spineX>0?nxt[0]:null);
  const nRight= nxt.length>1?nxt[1]:(N.spineX>0?null:nxt[0]);
  const leafSrc = fwd?curRight:curLeft;        // the face that turns over
  const leafBack= fwd?nLeft:nRight;            // its reverse side
  const staticSide = fwd?curLeft:curRight;     // stays put
  const revealed  = fwd?nRight:nLeft;          // appears underneath
  if(!leafSrc||!leafBack){ curS=ns; renderSpread(ns); return; }
  await Promise.all([leafBack,revealed].filter(Boolean).map(loadHalf));

  const spine=L.spineX, W=L.w, H=Math.max(L.h,N.h);
  const leafBox = fwd ? {x:spine,y:0,w:Math.max(W-spine,leafSrc.w),h:H}
                      : {x:0,y:0,w:Math.max(spine,leafSrc.w),h:H};
  sheet.innerHTML=''; ov.innerHTML='';
  if(staticSide) sheet.appendChild(halfImg(staticSide));
  if(revealed){
    const gapIn = fwd ? (revealed.x-N.spineX) : (N.spineX-(revealed.x+revealed.w));
    const rx = fwd ? spine+Math.max(0,gapIn) : spine-Math.max(0,gapIn)-revealed.w;
    sheet.appendChild(halfImg({...revealed,x:rx}));
  }
  turnLayer.innerHTML='';
  const leaf=document.createElement('div'); leaf.className='at-leaf';
  leaf.style.left=leafBox.x+'px'; leaf.style.top=leafBox.y+'px';
  leaf.style.width=leafBox.w+'px'; leaf.style.height=leafBox.h+'px';
  leaf.style.transformOrigin = fwd?'left center':'right center';
  const frontRect={x:leafSrc.x-leafBox.x,y:leafSrc.y,w:leafSrc.w,h:leafSrc.h};
  const gapB = fwd ? (N.spineX-(leafBack.x+leafBack.w)) : (leafBack.x-N.spineX);
  const backRect={x:Math.max(0,gapB),y:leafBack.y,w:leafBack.w,h:leafBack.h};
  leaf.appendChild(faceEl('front',leafSrc,frontRect,leafBox));
  leaf.appendChild(faceEl('back',leafBack,backRect,leafBox));
  turnLayer.appendChild(leaf); turnLayer.classList.add('on');

  const a=leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${fwd?-180:180}deg)`}],
    {duration:ms,easing:'cubic-bezier(.36,.06,.32,1)'});
  leaf.querySelectorAll('.shade').forEach(sh=>
    sh.animate([{opacity:0},{opacity:.5},{opacity:0}],{duration:ms,easing:'ease-in-out'}));
  await settle(a,ms);
  turnLayer.classList.remove('on'); turnLayer.innerHTML='';
  const zBefore=book._z;
  curS=ns; renderSpread(ns);
  // spreads differ slightly in size, so the fitted zoom changes: ease into it instead of snapping
  const zAfter=book._z;
  if(zBefore&&Math.abs(zAfter-zBefore)>1e-4){
    book.style.transition='none'; box.style.transition='none';
    book.style.transform=`scale(${zBefore})`; box.style.width=(N.w*zBefore)+'px'; box.style.height=(N.h*zBefore)+'px';
    book.getBoundingClientRect();
    book.style.transition='transform .45s ease'; box.style.transition='width .45s ease,height .45s ease';
    book.style.transform=`scale(${zAfter})`; box.style.width=(N.w*zAfter)+'px'; box.style.height=(N.h*zAfter)+'px';
    setTimeout(()=>{book.style.transition='';box.style.transition='';},500);
  }
}

/* one turn at a time; the newest request wins */
let wanted=null, running=false;
function goTo(ns,opts={}){
  wanted={ns:Math.max(0,Math.min(MAXS,ns)),opts};
  if(!running) run();
}
async function run(){
  running=true;
  try{
    while(wanted){
      const {ns,opts}=wanted; wanted=null;
      if(ns===curS){ drawOverlay(); if(opts.centre) centreOnTarget(); continue; }
      const skip=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const gap=Math.abs(ns-curS);
      try{
        if(skip){ curS=ns; renderSpread(ns); }
        else if(gap===1) await turnTo(ns,620);
        else if(gap<=4){
          const dir=ns>curS?1:-1, step=Math.max(190,440/gap);
          for(let t=curS+dir;;t+=dir){ preload(t); if(t===ns) break; }   // riffle without stalls
          for(let t=curS+dir;;t+=dir){ await turnTo(t,step); if(t===ns||wanted) break; }
        }
        else await turnTo(ns,380);              // one quick flip for a distant page
      }catch(e){ curS=ns; renderSpread(ns); }
      if(!wanted){
        preload(Math.min(MAXS,curS+1)); preload(Math.max(0,curS-1));
        if(opts.centre) centreOnTarget();
      }
    }
  } finally { running=false; }
}
function goToPage(p,opts){ goTo(spreadOfPage(p),opts); }


/* ---------- venues ---------- */
const CAT_COLOURS={restaurant:'#c62828',cafe:'#8d6e63',coffeeshop:'#6d4c41',bar:'#ad1457',pub:'#ef6c00',music:'#6a1b9a',theatre:'#283593',
  comedy:'#f9a825',gallery:'#00838f',cinema:'#1565c0',club:'#d81b60',shop:'#2e7d32',market:'#558b2f',other:'#546e7a'};
const catColour=c=>CAT_COLOURS[c]||CAT_COLOURS.other;
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let VENUES=[], selected=null, catFilter=null, keyPage=0;
const KEY_PER=(opts.keyPerPage||12);
const passes=v=>!catFilter||(v.category||'other')===catFilter;
function placeVenue(v){
  if(v.lat==null||v.lng==null) return v;
  const [E,N]=wgsToEN(v.lat,v.lng); v.E=E; v.N=N; v.Ek=E/1000; v.Nk=N/1000;
  const hits=pagesAt(v.Ek,v.Nk); v.geo=true; v.page=hits.length?hits[0].p:null;
  if(v.page){const g=PAGES[v.page]; v.ref=gridRef(v.page,(v.Ek-g.E)*g.T,(g.N-v.Nk)*g.T);}
  return v;
}
function renderCats(){
  const counts={}; for(const v of VENUES){const c=v.category||'other'; counts[c]=(counts[c]||0)+1;}
  $('.at-cats').innerHTML=Object.keys(counts).sort().map(c=>`<button data-cat="${c}" aria-pressed="${catFilter===c}" style="--c:${catColour(c)}"><span class="dot"></span>${c}</button>`).join('');
}
function keyList(){ return [...VENUES].filter(passes).sort((a,b)=>a.name.localeCompare(b.name)); }
function renderIndex(){
  const list=keyList(), pages=Math.max(1,Math.ceil(list.length/KEY_PER));
  if(selected!=null){ const k=list.findIndex(v=>v.id===selected); if(k>=0) keyPage=Math.floor(k/KEY_PER); }
  keyPage=Math.min(keyPage,pages-1);
  const slice=list.slice(keyPage*KEY_PER,(keyPage+1)*KEY_PER);
  $('.at-index').innerHTML=slice.map(v=>`<button class="at-idx" data-v="${v.id}" aria-current="${selected===v.id}" style="--c:${catColour(v.category)}">
      <span class="dot"></span><span class="name">${esc(v.name)}</span><span class="dots"></span>
      <span class="ref${v.geo&&v.page?'':' none'}">${v.geo?(v.page?(v.ref?v.ref+' ':'')+v.page:'off map'):'—'}</span></button>`).join('')
    + '<div class="at-idx-pad" style="--n:'+Math.max(0,KEY_PER-slice.length)+'"></div>';
  $('.at-count').textContent=`${list.length} places`;
  $('.at-pager').hidden = pages<=1;
  $('.at-pnum').textContent=`${keyPage+1} / ${pages}`;
  $('.at-pprev').disabled = keyPage===0; $('.at-pnext').disabled = keyPage>=pages-1;
}
$('.at-pprev').onclick=()=>{ keyPage=Math.max(0,keyPage-1); renderIndex(); };
$('.at-pnext').onclick=()=>{ keyPage=keyPage+1; renderIndex(); };
function renderCards(){
  const v=VENUES.find(x=>x.id===selected);
  $('.at-cards').innerHTML=!v?'':`<div class="at-card" style="--c:${catColour(v.category)}">
      ${v.image_url?`<img src="${esc(v.image_url)}" alt="" onerror="this.remove()">`:'<span class="noimg"></span>'}
      <span class="body"><span class="cat"><i class="dot"></i>${esc(v.category||'other')}${v.page?` · page ${v.page}${v.ref?' · sq '+v.ref:''}`:''}${v.upcoming_count?` · ${v.upcoming_count} upcoming`:''}</span>
      <b>${esc(v.name)}</b>${v.description?`<span class="blurb">${esc(v.description)}</span>`:''}
      ${v.address?`<span class="addr">${esc(v.address)}</span>`:''}${v.opening_hours&&typeof v.opening_hours==='string'?`<span class="addr">${esc(v.opening_hours)}</span>`:''}
      <span class="links">${v.website?`<a href="${esc(v.website)}" target="_blank" rel="noopener">website</a>`:''}${v.geo?`<a href="https://www.google.com/maps?q=${v.lat},${v.lng}" target="_blank" rel="noopener">google maps</a>`:''}</span></span></div>`;
}
function selectVenue(id, fromCard){
  const v=VENUES.find(x=>x.id===id); if(!v) return;
  selected=id; renderIndex();
  if(v.geo&&v.page){ target={Ek:v.Ek,Nk:v.Nk}; if(curS===KEY_S&&fromCard!=='turn'){ drawOverlay(); renderCards(); } else goToPage(v.page,{centre:true}); }
  else { target=null; drawOverlay(); }
  renderCards();

}
$('.at-cats').onclick=e=>{const b=e.target.closest('[data-cat]'); if(!b) return; catFilter=catFilter===b.dataset.cat?null:b.dataset.cat; if(selected!=null&&!passes(VENUES.find(v=>v.id===selected))){selected=null;target=null;} keyPage=0; renderCats(); renderIndex(); drawOverlay(); renderCards();};
$('.at-index').onclick=e=>{const b=e.target.closest('.at-idx'); if(b) selectVenue(+b.dataset.v);};
ov.addEventListener('click',e=>{const p=e.target.closest('.at-vpin,.at-dot'); if(p&&!dragged){e.stopPropagation(); const id=+p.dataset.v; selectVenue(id, (curS===KEY_S&&selected===id)?'turn':false);}});
$('.at-whole').onclick=()=>{ zoom=null; goTo(KEY_S); };
sheet.addEventListener('click',e=>{
  if(dragged||running||curS!==KEY_S) return;
  const r=book.getBoundingClientRect(), z=book._z; const km=keyKm((e.clientX-r.left)/z,(e.clientY-r.top)/z);
  const hits=pagesAt(km.Ek,km.Nk); if(hits.length) goToPage(hits[0].p);
});
$('.at-prev').onclick=()=>goTo((wanted?wanted.ns:curS)-1);
$('.at-next').onclick=()=>goTo((wanted?wanted.ns:curS)+1);
function centreOnTarget(){
  if(!target) return; const L=layout(curS); if(!L.geo) return;
  const q=spreadPx(curS,target.Ek,target.Nk); if(!q) return; const z=book._z;
  vp.scrollLeft=Math.max(0,q.x*z-vp.clientWidth/2); vp.scrollTop=Math.max(0,q.y*z-vp.clientHeight/2);
}
function setZoom(z,anchor){
  const L=layout(curS), prev=book._z;
  zoom = z===null?null:Math.min(4,Math.max(fitZoom()*0.9,z));
  if(anchor){
    const nz=zoom===null?fitZoom():zoom;
    const ax=(vp.scrollLeft+anchor.x)/prev, ay=(vp.scrollTop+anchor.y)/prev;
    book._z=nz; book.style.transform=`scale(${nz})`;
    box.style.width=(L.w*nz)+'px'; box.style.height=(L.h*nz)+'px';
    vp.scrollLeft=ax*nz-anchor.x; vp.scrollTop=ay*nz-anchor.y;
    ov.querySelectorAll('.at-pin,.at-vpin').forEach(el=>el.style.transform=`translate(-50%,-100%) scale(${1/nz})`);
    ov.querySelectorAll('.at-dot').forEach(el=>el.style.transform=`translate(-50%,-50%) scale(${1/nz})`);
  } else applyZoom(true);
  drawOverlay();
}
vp.addEventListener('wheel',e=>{
  if(!(e.ctrlKey||e.metaKey)) return;
  e.preventDefault(); const r=vp.getBoundingClientRect();
  setZoom((book._z||1)*(e.deltaY<0?1.12:1/1.12),{x:e.clientX-r.left,y:e.clientY-r.top});
},{passive:false});
let down=null,dragged=false;
vp.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,sl:vp.scrollLeft,st:vp.scrollTop}; dragged=false;vp.classList.add('drag');});
vp.addEventListener('pointermove',e=>{if(!down)return; const dx=e.clientX-down.x,dy=e.clientY-down.y; if(Math.abs(dx)+Math.abs(dy)>4)dragged=true; vp.scrollLeft=down.sl-dx;vp.scrollTop=down.st-dy;});
addEventListener('pointerup',()=>{down=null;vp.classList.remove('drag'); setTimeout(()=>dragged=false,60);});
addEventListener('resize',()=>{if(curS!=null){applyZoom(true);drawOverlay();}});
addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]')) return;
  const r=root.getBoundingClientRect(); if(r.bottom<innerHeight*.25||r.top>innerHeight*.75) return;
  if(e.key==='ArrowRight'){e.preventDefault();$('.at-next').click();} else if(e.key==='ArrowLeft'){e.preventDefault();$('.at-prev').click();}
});

/* ---------- boot ---------- */
curS=spreadOfPage(opts.startPage||67); renderSpread(curS);
fetch(opts.venues,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status)).then(d=>{
  VENUES=(d.venues||[]).map(placeVenue); renderCats(); renderIndex(); drawOverlay(); describe();
}).catch(e=>{ $('.at-count').textContent='could not load'; });
preload(curS+1); preload(curS-1);
return { goToPage, selectVenue };
};
