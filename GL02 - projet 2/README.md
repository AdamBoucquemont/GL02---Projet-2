# GL02_A21_A

Authors : Dorian Boucher | Tristan Coldefy | Thibault Pavée

Révision apportées par : Adam BOUCQUEMONT | Kyoma GRANDJEAN | Li Zixiao

## Commands

- readme : Montre le contenu du fichier readme
  readme 'file'  
  exemple : readme README.md 

- createCalendar(SPEC01) : Créer un fichier iCalendar directement utilisable   
  cc 'cours' 'day' 'schedule'  
  exemple : cc AP03-D1,GL02 07/09/2021 24/12/2021 MonCalendrier

- checkRoomDisponibility (SPEC02) : Regarder si une salle est utilisé par un seul enseignant à la fois 
  crd 'room' 'Day' 'startDate' 'endDate' 
  exemple : crd S103 Jeudi 8:00-10:00    

- roomForClassAndSchedule (SPEC03) : Montre quelle salle est utilisée à un certain moment pour une certaine matière   
  rfcas 'room' 'day' 'schedule'   
  exemple : rfcas TPC01 Jeudi 8:00-10:00  

- findRoomAvailable (SPEC04) : Montre les salles libres à un certain moment   
  fra 'day' 'schedule'  
  exemple : fra Jeudi 8:00-10:00  

- whenRoomAvailable (SPEC05) : Montre quand une salle est libre   
  wra 'room'  
  exemple : wra S103  

- OccupationMax (SPEC06) : Montre le taut d'occupation d'une salle spécifique   
  om 'rooms' 'days'   
  exemple : om C104,S103 Lundi-Mercredi   

- findRoomPlace (SPEC07) : Montre les salles qui ont un certain nombre de places    
  frp 'place'   
  exemple : frp 24   

- maximumCapacity (SPEC08) : Montre la capacité maximale d'une salle   
  mc 'room'  
  exemple : mc S103  

- PlaceSup (SPEC_BONUS_01) : Montre les salles ayant plus qu'un certain nombre de places (sur chargées)   
  psp 'place'   
  exemple : psp 30   

- PlaceInf (SPEC_BONUS_02) : Montre les salles ayant moins d'un certain nombre de places (sous chargée)    
  pif 'place'    
  exemple : pif 10   


- checkRoomOccupation (SPEC_BONUS_03) : Montrer combien de temps est utilisé une ou plusieurs salles sur un ou plusieurs jours   
  cro 'rooms' 'days'   
  exemple : cro C104,S103 Lundi-Mercredi  

- checkRoomDisponibilityAll (SPEC_BONUS_04) : Regarder si l'ensemble des salles sont utilisées une seule fois à la fois
  crda 'room' 'jour' 'startDate' 'endDate' 
  exemple : crda S103 Jeudi 8:00-10:00  
