# MonkeyBox
Lotería que utiliza aleatoriedad verificable para garantizar transparencia.

Posee tres esquemas de privacidad con distintos grados de verificabilidad.

- Lotería pública: La lista de participantes y ganadores es pública, por lo que todo el sistema es completamente verificable.
- Lotería semi-pública: La lista de participantes es pública, la aleatoriedad es verificable y se le da acceso a entes externos para que puedan verificar la lista de participantes.
- Lotería privada: Cada usuario puede verificar que fue inscrito correctamente y revisar su resultado, pero no conoce información sobre los otros participantes ni se puede verificar la correctitud del resto de la lista. La aleatoriedad sigue siendo verificable.

|                                                | Privada | Semi-pública | Pública |
|------------------------------------------------|---------|--------------|---------|
| Todos saben cuantos participan                 |    ✅    |       ✅      |    ✅    |
| Se puede verificar el random                   |    ✅    |       ✅      |    ✅    |
| Cada usuario puede demostrar que ganó o perdió |    ✅    |       ✅      |    ✅    |
| Todos saben quiénes participan                 |         |       ✅      |    ✅    |
| Se puede verificar el conjunto de inscritos    |         |       ✅      |    ✅    |
| Todos saben quiénes ganaron                    |         |              |    ✅    |
