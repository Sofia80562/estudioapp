# Misión

Proveer una plataforma de gestión académica integral, diseñada para optimizar el flujo de trabajo de los estudiantes universitarios mediante una arquitectura modular y orientada a la eficiencia operativa.

## Qué construimos

Construimos un sistema de productividad (Productivity-as-a-Service) que automatiza la gestión de tareas, la administración del tiempo de estudio y la organización de entregas, resolviendo la desorganización crónica y la ineficiencia en el seguimiento de plazos académicos.

1. **Motor de Productividad Académica** — Un núcleo que gestiona la disponibilidad del estudiante, hitos académicos y bloques de tiempo basados en "actividades" genéricas, permitiendo organizar desde una tarea simple hasta una sesión de estudio profunda, sin alterar la estructura base del sistema.
2. **Arquitectura de Usuario Personal y Productividad** — Un sistema de control de eventos y estados que permite gestionar múltiples contextos académicos (materias, proyectos, semestre) con total aislamiento, trazabilidad y enfoque en el rendimiento.
3. **Plataforma Base Extensible** — Una base de datos y API documentada, lista para acoplar módulos futuros como integración con calendarios externos, analítica de desempeño estudiantil y gestión de grupos de trabajo, sin romper el flujo principal.

## Para quién

* **Estudiantes Universitarios:** Buscan centralizar sus responsabilidades, controlar múltiples asignaturas desde un solo lugar, evitar choques de plazos y gestionar su tiempo con precisión técnica.
* **Equipos de desarrollo:** Se benefician de una estructura de código predecible y fuertemente tipada que permite extender la aplicación con nuevas funcionalidades sin ambigüedades.

## Principios

* **La Tarea sobre la Materia (Abstracción por diseño):** Nunca limitamos la base de datos a "materias". Todo elemento de estudio es un *task* con estados definidos. Esto garantiza que la plataforma escale a cualquier modelo de flujo de trabajo académico.
* **El Contrato es la Ley (Spec-Driven Development):** Ningún endpoint se programa sin antes haber definido su especificación. Esto asegura fiabilidad y pruebas automatizadas.
* **Modularidad Intransigente:** Los dominios (Autenticación, Gestión de Tareas, Temporizadores, Analítica) viven en silos funcionales estrictos.
* **Trazabilidad:** Todo cambio en el estado de una tarea queda registrado, asegurando un historial limpio del rendimiento del estudiante.

## Qué NO es

* **NO es** un simple gestor de notas o una lista de "por hacer" estática y sin estructura.
* **NO es** una herramienta de comunicación social, ni un sistema de mensajería académica.
* **NO es** un sistema acoplado donde la interfaz de usuario dicte la lógica del negocio o la integridad de la base de datos.