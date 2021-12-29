#ifdef GL_ES
      precision lowp float;
      precision lowp int;
#endif

#define PI  3.14159265358
#define TAU 6.28318530718
// #define PHI 1.61803398874

#define MAX_ROCKETS 30
#define MAX_SPARKLES 20.

uniform vec2 u_resolution;
uniform float u_time;

uniform int count;
uniform vec2 positions[MAX_ROCKETS];
uniform float explosions[MAX_ROCKETS];
uniform float seeds[MAX_ROCKETS];

float n21(vec2 p) {
    p = fract(p * vec2(233.34, 851.73));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
    // return fract(sin(p.x * 315.7 + p.y * 531.7)*9786.3);
}
vec2 n22(vec2 p) {
    float n = n21(p);
    return vec2(n, n21(p + n));
}

float hash(float t) {
    t = fract(t * 851.73);
    t += dot(t, t + 23.45);
    return fract(t);
}
vec2 h12(float t) {
    float x = fract(sin(t * 315.7)*9786.3);
    float y = fract(sin((t+x) * 315.7)*9786.3);
    return vec2(x, y);
}
vec2 h12_polar(float t) {
    float a = fract(sin(t * 315.7)*9786.3) * TAU;
    float d = fract(sin((t+a) * 315.7)*9786.3);
    return vec2(sin(a), cos(a)) * d;
}

float Rocket(in vec2 _uv, in vec2 _pos, in float _seed, in float _time) {
    _uv -= _pos;
    float b = 0.00005;
    b *= 0.75 + 0.25 * sin((50. + 25. * hash(_seed)) * _time);
    float d = length(_uv);
    return b / dot(d, d);
}

float Sparks(in vec2 _uv, in vec2 _pos, in float _seed, in float _time) {
    float s = 0.;
    float t = 1. - pow(_time - 1., 2.);
    _uv -= _pos;
    for (float i = 0.; i < MAX_SPARKLES; i += 1.) {
        vec2 dir = 0.25 * h12_polar(_seed + i);
        float d = length(_uv - dir * t);
        float b = 0.001;
        // float b = mix(.0005, .0001, smoothstep(0.2, 0.0, _t) - smoothstep(1.0, 0.2, _t));
        // b *= 0.5 + 0.5 * sin(25. * _t + i);
        s += b / d;
    }
    return s;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
    vec3 rgb = vec3(0.);

    for (int i = 0; i < MAX_ROCKETS; i++) {
        if (i < count) {
            rgb += Rocket(uv, positions[i], seeds[i], u_time) * smoothstep(.1, .0, explosions[i]);

            if (explosions[i] > 0.) {
                rgb += Sparks(uv, positions[i], seeds[i], explosions[i]);
            }
        }
    }

    rgb += vec3(uv, 0.0);

    gl_FragColor = vec4(rgb, 1.0);
}