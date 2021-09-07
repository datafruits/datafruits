precision mediump float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;
uniform float customUniform;

void main(void)
{
  float speed=0.02;
  float frequency=100.0;
  float amplitude=0.02;

  float distortion=cos(vTextureCoord.x*frequency+customUniform*speed)*amplitude;
  float speed2=0.02;
  float frequency2=10.0;
  float amplitude2=0.3;
  float distortion2=sin(vTextureCoord.x*frequency2+customUniform*speed2)*amplitude2;

  vec4 fg = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y+distortion2));

  vec4 destColor = vec4(.0, .0, .0, 1.0);

  //if(fg.a == 0.0){
   //fg.b = uvs.y + sin(customUniform);
   //fg.r = uvs.y + cos(customUniform + 0.5);
   //fg.g = uvs.y + tan(customUniform + 0.2);
  //}

    float a = fg.a;
    float colorSpeed = 0.01;

    if (a == 0.0) {
      gl_FragColor = vec4(
        abs(cos(customUniform*colorSpeed * 2.0 + 2.0))+distortion2,
        abs(sin(customUniform*colorSpeed + 2.0))+distortion,
        abs(cos(customUniform*colorSpeed + 5.0))+distortion,
        clamp(cos(customUniform*colorSpeed),0.0,1.0));
    }
    else {
      gl_FragColor = fg;
    }


   //fg.r = clamp(fg.r,0.0,0.9);
}
