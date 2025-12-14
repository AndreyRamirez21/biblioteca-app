# Stage 1: Build (Compilar el proyecto)
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar pom.xml y descargar dependencias (capa cacheada)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar codigo fuente
COPY src ./src

# Compilar el proyecto
RUN mvn clean package -DskipTests

# Stage 2: Run (Ejecutar la aplicacion)
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado desde el stage anterior
COPY --from=build /app/target/notification-service-1.0.0.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]