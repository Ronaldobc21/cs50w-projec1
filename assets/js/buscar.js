//So messy, dont judge me. I made this on a friday

var clock;
var scene, camera, renderer, group, blink;

init();
animate();

function set3(param, val){param.set(val.x, val.y, val.z)}

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 45, 50 / 50, 1, 1000 );
  camera.position.set(0,0,20);

  var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  
  var g1 = new THREE.TorusBufferGeometry(1, 0.2, 24, 24, 6.283185);
  g1 = new THREE.Mesh( g1, material );
  
  var g2 = new THREE.CylinderBufferGeometry(0.2, 0.2, 2.1, 24, 1);
  g2 = new THREE.Mesh( g2, material );
  g2.position.y = -1.954175;
  
  var g3 = new THREE.SphereBufferGeometry(0.2, 24, 24, 0, 6.283185, 0, 3.141593);
  g3 = new THREE.Mesh( g3, material );
  g3.position.y = -3.034119;

  group = new THREE.Group();
  group.add(g1);group.add(g2);group.add(g3);
  scene.add(group);
  group.scale.set(2.7,2.7,2.7);
  group.rotation.z = 2.1/Math.PI;
  group.position.y = 3;
  
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( 50, 50 );
  $('#wrapper').append(renderer.domElement);

  clock = new THREE.Clock();

}

function animate(time) {
	requestAnimationFrame(animate);
	TWEEN.update(time);
  render();
}


function render() {
    var delta = clock.getDelta();
    renderer.render(scene, camera);
}


$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

function searchFocus(){
  
  var w = $(this).textWidth();
  $(this).parent().children('canvas').show();
  $(this).parent().addClass('focused');
  
  if(w!=0){
    $('#wrapper input').parent().children('canvas').css('transition-property', 'none');
  }
  
  var group_from = {x:group.rotation.x, y:group.rotation.y, z:group.rotation.z};
  var group_to = {x:0,y:-4.9/Math.PI,z:0};
  
  var groupAnim = new TWEEN.Tween(group_from).to(group_to, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(function(){
    set3(group.rotation, group_from);
  }).start();
  
  var opacity = {o:1};
  blink = new TWEEN.Tween(opacity).to({o:0}, 1200).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function(){
    $('#wrapper input').parent().children('canvas').css('opacity', opacity.o);
  }).repeat(Infinity).start();
}

function searchBlur(){
  blink.stop();
  $('#wrapper input').parent().children('canvas').css('transition-property', 'left, top');
  $('#wrapper input').parent().children('canvas').css('opacity', 1);
  $(this).parent().removeClass('focused');
  var w = $(this).textWidth();
  
  var group_from = {x:group.rotation.x, y:group.rotation.y, z:group.rotation.z};
  var group_to = {x:0,y:0,z:2.1/Math.PI};
  
  var groupAnim = new TWEEN.Tween(group_from).to(group_to, 1000).easing(TWEEN.Easing.Elastic.Out).onUpdate(function(){
    set3(group.rotation, group_from);
  })
  
  if(w==0){
    groupAnim.start();
  }else{
    $(this).parent().children('canvas').hide();
  }
}

$('#wrapper input').on('focus', searchFocus);
$('#wrapper input').on('blur', searchBlur);

$('#wrapper input').on('input', function() {
  var tw = $(this).width();
  var w = $(this).textWidth();
  if(w >= tw){
    $(this).parent().children('canvas').css('margin-left', tw+8);
  }else{
    $(this).parent().children('canvas').css('margin-left', w==0?w:w+8);
  }
  
}).trigger('input');