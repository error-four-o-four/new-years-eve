#ifdef GL_ES
      precision lowp float;
      precision lowp int;
#endif

#define PI  3.14159265358
#define TAU 6.28318530718
// #define PHI 1.61803398874

#define MAX_ROCKETS 50
#define MAX_SPARKLES 40.

uniform vec2 u_resolution;
uniform float u_time;

uniform int count;
uniform float seeds[MAX_ROCKETS];
uniform vec3 colors[MAX_ROCKETS];
uniform vec2 positions[MAX_ROCKETS];
uniform vec2 velocities[MAX_ROCKETS];
uniform float explosions[MAX_ROCKETS];

const float bgtTrail = .000025;
const float bgtTrailSparkle = .00001;
const float bgtExplosion = .0025;
const float bgtExplosionSparkle = .000005;
const float dstExplosionSaprkle = .15;

float rand(float n) {
    return fract(dot(fract(n * 12.9898), fract(n * 4.1414)) * 43.5453);
}
float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43.5453);
}

vec2 randPolar(float t) {
    float a = fract(sin(t * 12.9898) * 11.3179) * TAU;
    float d = fract(sin((t+a) * 17.7391) * 13.1937);
    return vec2(sin(a), cos(a)) * d;
}

vec3 Rocket(in vec2 _uv, in float _seed, in vec3 _rgb, in vec2 _pos, in vec2 _vel, in float _expl, in float _time) {
    _uv -= _pos;
    float d = dot(_uv, _uv) * 2.;
    float trail = (bgtTrail / d);

    vec2 st = _uv - .01 * randPolar(_seed + fract(_time) + 1.) + _vel;
    trail += (bgtTrailSparkle / dot(st, st)) * (.5 + .5 * sin(18. * TAU * _seed * _time));
    trail *= smoothstep(.1, .0, _expl);

    float expl = (bgtExplosion * smoothstep(.0, .05, _expl) * smoothstep(.25, .05, _expl)) / d;
    float sparkle = 0.;

    if (_expl > 0.) {
        for (float i = 0.; i < MAX_SPARKLES; i += 1.) {
            vec2 st = _uv - dstExplosionSaprkle * randPolar(rand(_seed + i)) * _expl;
            float b = bgtExplosionSparkle * smoothstep(1., 0., _expl);
            float d = dot(st, st);
            b *= 0.5 + 0.5 * sin(20. * _time + i);
            sparkle += (b / d);
        }
    }

    return trail * vec3(1., .5, .005) + expl * _rgb + sparkle * _rgb;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;
    vec3 rgb = (0.5 - uv.y) * vec3(.0005, .0005, .025);

    for (int i = 0; i < MAX_ROCKETS; i++) {
        if (i < count) {
            rgb += Rocket(uv, seeds[i], colors[i], positions[i], velocities[i], explosions[i], u_time);
        }
    }

    gl_FragColor = vec4(pow(rgb, vec3(.4545)), 1.);
}