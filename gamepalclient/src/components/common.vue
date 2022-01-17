<script type="text/javascript">
  import scenes from '../../static/scenes.json'
  // 定义一些公共的属性和方法 
  const httpUrl = 'http://39.105.17.99:8080/'

  var userDatas = new Map()
  var userData = {}

  var positionMap

  var userCode
  var sceneNo
  var nearbySceneNos
  var playerX
  var playerY
  var playerNextX
  var playerNextY
  var playerSpeedX
  var playerSpeedY
  // Never exceed 1
  const playerMaxSpeedX = 0.05
  // Never exceed 1
  const playerMaxSpeedY = 0.05
  const acceleration = 0.01
  // 1-E 2-NE 3-N 4-NW 5-W 6-SW 7-S 8-SE
  var playerDirection

  var firstName
  var lastName
  var nickname
  var nameColor
  var creature
  var gender
  var skinColor
  var hairstyle
  var hairColor
  var eyes
  var outfit

  function commonFun() {
    console.log("公共方法")
  }
  // 暴露出这些属性和方法
  export default {
    scenes,
    userDatas,
	userData,
	userCode,
	sceneNo,
	playerX,
	playerY,
	playerNextX,
	playerNextY,
	playerSpeedX,
	playerSpeedY,
	playerMaxSpeedX,
	playerMaxSpeedY,
	playerDirection,
	firstName,
    lastName,
    nickname,
    nameColor,
    creature,
    gender,
    skinColor,
    hairstyle,
    hairColor,
    eyes,
    outfit
  }
</script>