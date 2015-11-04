#include "Rosys.h"
int a=0;

void setup(){
    initTimer3();
}

void loop(){
    for(;;){
        a=1;
        if(a==0){
         IoOutB(B, 1, 0);
        }else{
         IoOutB(B, 1, 1);
         }
    }
}
