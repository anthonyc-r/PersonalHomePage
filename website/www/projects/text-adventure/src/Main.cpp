#include <iostream>
#include <cstring>
#include <cstdlib>
#include <ctime>
#include <string>

using namespace std;

string map[3][3];
int choice;
int xPos = 1;
int lastxPos = 1;
int yPos = 1;
int lastyPos = 1;
char name[20];
int charHealth = 100;
int charAP = 100;
int prevCharLevel = 1;
int charLevel = 1;
int charExp=100;
int dangerLevel=1;
int damage;

string monsName;
int monsLevel;
int monsHealth;

int randomInt(int x){
	srand((unsigned)time(0));
	int randomInt = (rand()%x)+1;
	return randomInt;
}

void playerMove();
void initBattle();

void updateChar(){
	charLevel = charExp/100;
	charAP = charLevel*10;
}

void healChar(int percent){
			charHealth = (charLevel*100)*(percent/100);
}

void updateMap(){
	if(xPos > 3 || xPos < 1 || yPos > 3 || yPos < 1){
		cout<<endl<<"It would be silly to go any further in that direction, \nas you have no mountian boots, you step back to the last area."<<endl<<endl;
		yPos = lastyPos;
		xPos = lastxPos;
		updateMap();
	}
	else{
	switch(yPos){
		case 1:{
			if(xPos == 1){
				cout<<endl<<"You enter a bright, grassy area. \nBy the look of things there is no danger. \nYou can see some people in the distance.";
				dangerLevel = 10;
			}
			else if(xPos == 2){
				cout<<endl<<"The land ahead of you is still very grassy, yet rocks\n are starting to appear, you can sense animals watching";
				dangerLevel = 20;
			}
			else if(xPos == 3){
				cout<<endl<<"You can see mountians ahead, it would be impossible to go further east \nalso, it feels dangerous here, best not to tarry.";
				dangerLevel = 30;
			}
				break;
			   }
		case 2:{
			if(xPos == 1){
				cout<<endl<<"You start to see rocks here and there, \nalso you feel the watchful eyes of many animals following you";
				dangerLevel = 20;
			}
			else if(xPos == 2){
				cout<<endl<<"It seems fairly dangerous here, you can \nfeel something watching you, it's not friendly eather.";
				dangerLevel = 50;
			}
			else if(xPos == 3){
				cout<<endl<<"These lands are very dangerous \nmountians cover the lands to the east and \n you can see mountians to the distant north";
				dangerLevel = 75;
			}
			   break;
			   }
		case 3:{
			if(xPos == 1){
				cout<<endl<<"The north is covered in mountians, and the lands ahead seem very \ndangerous, it would be best to avoid staying too long";
				dangerLevel = 30;
			}
			else if(xPos == 2){
				cout<<endl<<"This is getting very dangerous now, \nnowhere is safe, you can feel the \nnative beings disire to kill. \nTo kill you.";
				dangerLevel = 75;
			}
			else if(xPos == 3){
				cout<<endl<<"This is it, \nahead lies the very center of the world \nit would not be wise to enter unprepaired";
				dangerLevel = 120;
			}
				break;
			   }
		}
	lastyPos = yPos;
	lastxPos = xPos;
	initBattle();
	}
}

void showMap(){
	char *map[3][3];
	for(int x=1;x<4;x++){
		for(int y=1;y<4;y++){
			*map[x][y] = '#';
		}
	}
	*map[xPos][yPos] = '+';
}

void playerMove(){
	cout<<endl<<"===================================================================\n===================================================================";
	cout<<endl<<"Which direction do you want to travel in?"<<endl<<"North(1)? East(2)? South(3)? or West(4)?"<<endl<<"Show Map(5)"<<endl;
	cin>>choice;
	switch(choice){
		case 1:
			yPos=yPos+1;
			break;
		case 2:
			xPos=xPos+1;
			break;
		case 3:
			yPos=yPos-1;
			break;
		case 4:
			xPos=xPos-1;
			break;
		case 5:
			//showMap();
			break;
		default:
			cout<<"Error reading input"<<endl;
			playerMove();
	}
	updateMap();
}

void initMonster(){
	monsLevel = randomInt(charLevel);
	monsHealth = monsLevel*100-10;
	switch(monsLevel){
		case 1:
			monsName = "Rat";
			break;
		case 2:
			monsName = "Spider";
			break;
		case 3:
			monsName = "Goblin";
			break;
		case 4:
			monsName = "Swordsman";
			break;
	}
}
void initBattle(){
	if((randomInt(100)<dangerLevel)&dangerLevel!=120){
	initMonster();
	cout<<endl<<"You encountered a monster!"<<endl;
	cout<<monsName<<" Appeared!"<<endl<<endl;
	while(monsHealth>0){
		cout<<"Monster: "<<monsHealth<<endl;
		cout<<"You: "<<charHealth<<endl<<endl;
		cout<<"What will you do?"<<endl;
		cout<<"Attack!(1)"<<endl<<"Cast Spell(2)"<<endl;
		cin>>choice;
		switch(choice){
		case 1:{
			if(randomInt(100)>10){
			damage = charLevel*50;
			monsHealth = monsHealth-damage;
			cout<<"You do "<<damage<<" damage to the "<<monsName<<"!"<<endl;
			}
			else{
				damage = charLevel*100;
				monsHealth = monsHealth-damage;
				cout<<"Its critical strike!"<<endl<<"You do "<<damage<<" to the "<<monsName<<"!"<<endl;
			}
			break;
		}
		case 2:{
				damage = charLevel*100;
				monsHealth = monsHealth-damage;
				cout<<"You cast a spell."<<" It does "<<damage<<" damage!"<<endl;
				charAP=charAP-10;
				break;
		}
	}
		damage=monsLevel*10;
		charHealth = charHealth-damage;
		cout<<"The "<<monsName<<" attacks! Dealing "<<damage<<" damage!"<<endl<<endl;
	}
	cout<<"You killed the "<<monsName<<"!"<<endl<<endl;
	charExp = charExp+monsLevel*10;
	prevCharLevel = charLevel;
	updateChar();
	if(charLevel==prevCharLevel+1)
		cout<<endl<<endl<<"Congratulations!! You just advanced to level "<<charLevel<<"!"<<endl;
}
	else if(dangerLevel == 120){
		cout<<"Are you sure you wish to continue in this direction?\nUp ahead you can see a large ominous mountian \ncloaked in fog and bathing in darkness.\n\nYES(1)\nNO(2)"<<endl;
		cin>>choice;
		if(choice == 1){
			yPos = lastyPos;
			xPos = lastxPos;
			updateMap();
		}
		else{
			cout<<"\nYou venture nearer";
		}
	}
	playerMove();
}


	
int main(){
updateChar();
	playerMove();
}