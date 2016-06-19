import ContextGL, {assertProgramBinding} from 'foam-context-gl/ContextGL';

const GLSL =
`#ifdef VERTEX_SHADER
 precision highp float;

 attribute vec4 aPosition;
 attribute vec3 aNormal;

 uniform mat4 uProjectionMatrix;
 uniform mat4 uViewMatrix;
 uniform mat4 uModelMatrix;
 uniform mat3 uNormalMatrix;

 uniform float uPointSize;
 varying vec3 vNormal;

 void main(){
     vNormal = normalize(uNormalMatrix * aNormal);
     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
     gl_PointSize = uPointSize;
 }
 #endif

 #ifdef FRAGMENT_SHADER
 precision highp float;

 varying vec3 vNormal;

 void main(){
    gl_FragColor = vec4(0.5 + vNormal * 0.5, 1.0);
 }
 #endif`;

const Default = {
    pointSize : 1.0
};

function NormalProgram(){
    this._ctx = ContextGL.sharedContext();
    this._program = this._ctx.createProgram(GLSL,[
        {name:'aPosition', location:this._ctx.ATTRIB_LOCATION_POSITION},
        {name:'aNormal', location:this._ctx.ATTRIB_LOCATION_NORMAL}
    ]);

    this._ctx.pushProgramBinding();
        this._ctx.setProgram(this._program);
        this.reset();
    this._ctx.popProgramBinding();
}

NormalProgram.prototype.setPointSize = function(size){
    assertProgramBinding(this._ctx,this._program);
    this._ctx.setProgramUniform('uPointSize',size);
};

NormalProgram.prototype.use = function(){
    this._ctx.setProgram(this._program);
};

NormalProgram.prototype.reset = function(){
    assertProgramBinding(this._ctx,this._program);
    this._ctx.setProgramUniform('uPointSize',Default.pointSize);
};

export default NormalProgram;