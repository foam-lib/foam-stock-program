import ContextGL, {assertProgramBinding} from 'foam-context-gl/ContextGL';

const GLSL =
    `#ifdef VERTEX_SHADER
 precision highp float;

 attribute vec4 aPosition;
 attribute vec2 aTexCoord;

 uniform mat4 uProjectionMatrix;
 uniform mat4 uViewMatrix;
 uniform mat4 uModelMatrix;
 uniform mat3 uNormalMatrix;

 uniform float uPointSize;
 varying vec2 vTexCoord;

 void main(){
     vTexCoord = aTexCoord;
     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
     gl_PointSize = uPointSize;
 }
 #endif

 #ifdef FRAGMENT_SHADER
 precision highp float;

 varying vec2 vTexCoord;

 void main(){
    gl_FragColor = vec4(vTexCoord.x,0,vTexCoord.y,1.0);
 }
 #endif`;

const Default = {
    pointSize : 1.0
};

function TexCoordProgram(){
    this._ctx = ContextGL.sharedContext();
    this._program = this._ctx.createProgram(GLSL,[
        {name:'aPosition', location:this._ctx.ATTRIB_LOCATION_POSITION},
        {name:'aTexCoord', location:this._ctx.ATTRIB_LOCATION_TEX_COORD}
    ]);

    this._ctx.pushProgramBinding();
    this._ctx.setProgram(this._program);
    this.reset();
    this._ctx.popProgramBinding();
}

TexCoordProgram.prototype.setPointSize = function(size){
    assertProgramBinding(this._ctx,this._program);
    this._ctx.setProgramUniform('uPointSize',size);
};

TexCoordProgram.prototype.use = function(){
    this._ctx.setProgram(this._program);
};

TexCoordProgram.prototype.reset = function(){
    assertProgramBinding(this._ctx,this._program);
    this._ctx.setProgramUniform('uPointSize',Default.pointSize);
};

export default TexCoordProgram;