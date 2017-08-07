//unit: m
var Canal = function(lc, lm, w, r, l, i){
  this.lc = lc;
  this.lm = lm;
  this.w = w;
  this.r = r;
  this.l = l;
  this.i = i;
};
Canal.prototype.fin = function () {
  if(this.u instanceof Gate) return this.u.es.fout();
  if(this.u instanceof Branch) return this.u.es.fout() / this.u.eds.length;
  if(this.u instanceof Merge){
    var ret = 0;
    for(var i = 0;i < this.u.ess.length;i++){
      ret += this.u.ess[i].fout();
    }
    return ret;
  }
  if(this.u instanceof Source) return this.u.f;

  return 0;
};
Canal.prototype.fout = function (){
  // referred from http://spokon.net/eelnews/hydraulics/012s.htm
  if(this.v && this.v instanceof Gate){
    var x = this.v.beta;
  }else{
    var x = 1
  }
  var n = 0.02;
  var a = this.w * (this.lc + this.r) * x;
  var r = a / (this.w + 2*(this.lc+this.r)*x);
  return a * Math.pow(n, -1) * Math.pow(r, 2/3) * Math.pow(this.i, 1/2);
}
Canal.prototype.setPoints = function(u, v){
  this.u = u;
  this.v = v;
}
Canal.prototype.nextFlow = function(){
  return Math.max(0, this.lc + this.fin()/this.l - this.fout()/this.l);
}

var Gate = function(es, ed, beta){
  this.es = es;
  this.ed = ed;
  this.beta = beta;
};

var Branch = function(es, eds){
  this.es = es;
  this.eds = eds;
};

var Merge = function(ess, ed){
  this.ess = ess;
  this.ed = ed;
};

var Source = function(ed, f){
  this.f = f;
  this.ed = ed;
};

var e_sb, e_bg1, e_bg2, e_g1m, e_g2m, e_m;
var s, b, g1, g2, m;
function init(){
  e_sb = new Canal(1, 2, 5, 0.01, 100, 0.01);
  e_bg1 = new Canal(1, 2, 5, 0.01, 100, 0.01);
  e_bg2 = new Canal(1, 2, 5, 0.01, 100, 0.01);
  e_g1m = new Canal(1, 2, 5, 0.01, 100, 0.01);
  e_g2m = new Canal(1, 2, 5, 0.01, 100, 0.01);
  e_m = new Canal(1, 2, 5, 0.01, 100, 0.01);

  s = new Source(e_sb, 20);
  b = new Branch(e_sb, [e_bg1, e_bg2]);
  g1 = new Gate(e_bg1, e_g1m, 1);
  g2 = new Gate(e_bg2, e_g2m, 1);
  m = new Merge([e_bg1, e_bg2], e_m);

  e_sb.setPoints(s, b);
  e_bg1.setPoints(b, g1);
  e_bg2.setPoints(b, g2);
  e_g1m.setPoints(g1, m);
  e_g2m.setPoints(g2, m);
  e_m.setPoints(m, null);

  show();
}

function timeshift(){
  g1.beta = Number(document.getElementById("beta_g1").value);
  g2.beta = Number(document.getElementById("beta_g2").value);
  s.f = Number(document.getElementById("f_s").value);
  e_sb.r = Number(document.getElementById("rf_sb").value);
  e_bg1.r = Number(document.getElementById("rf_bg1").value);
  e_bg2.r = Number(document.getElementById("rf_bg2").value);
  e_g1m.r = Number(document.getElementById("rf_g1m").value);
  e_g2m.r = Number(document.getElementById("rf_g2m").value);
  e_m.r = Number(document.getElementById("rf_m").value);

  e_sb.lc = e_sb.nextFlow();
  e_bg1.lc = e_bg1.nextFlow();
  e_bg2.lc = e_bg2.nextFlow();
  e_g1m.lc = e_g1m.nextFlow();
  e_g2m.lc = e_g2m.nextFlow();
  e_m.lc = e_m.nextFlow();

  show();
}

function show(){
  document.getElementById("f_s").value = s.f;
  document.getElementById("lc_sb").value = e_sb.lc;
  document.getElementById("lm_sb").value = e_sb.lm;
  document.getElementById("lc_bg1").value = e_bg1.lc;
  document.getElementById("lm_bg1").value = e_bg1.lm;
  document.getElementById("lc_bg2").value = e_bg2.lc;
  document.getElementById("lm_bg2").value = e_bg2.lm;
  document.getElementById("beta_g1").value = g1.beta;
  document.getElementById("beta_g2").value = g2.beta;
  document.getElementById("lc_g1m").value = e_g1m.lc;
  document.getElementById("lm_g1m").value = e_g1m.lm;
  document.getElementById("lc_g2m").value = e_g2m.lc;
  document.getElementById("lm_g2m").value = e_g2m.lm;
  document.getElementById("lc_m").value = e_m.lc;
  document.getElementById("lm_m").value = e_m.lm;

  document.getElementById("rf_sb").value = e_sb.r;
  document.getElementById("rf_bg1").value = e_bg1.r;
  document.getElementById("rf_bg2").value = e_bg2.r;
  document.getElementById("rf_g1m").value = e_g1m.r;
  document.getElementById("rf_g2m").value = e_g2m.r;
  document.getElementById("rf_m").value = e_m.r;
}
