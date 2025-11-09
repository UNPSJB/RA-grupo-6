// InformePDFDocument.tsx

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { DetalleInformeCatedraCompleto, DetalleInformeSinteticoCompleto} from "../types"; 
import Logo from "../../../assets/Unipat.png"

// --- Estilos para el PDF ---
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 11, color: '#333'},
  header: { marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 10 },
  headerImage: {width: 60, opacity: 0.5, position: "absolute", top: 0, right: 0},
  title: { fontSize: 24, fontFamily: 'Helvetica-Bold', textAlign:"center"},
  subtitle: { fontSize: 12, color: '#666', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', backgroundColor: '#f4f4f4', padding: 5, marginBottom: 10 },
  responseContainer: { marginBottom: 12 },
  question: { fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  answer: { fontStyle: 'italic', paddingLeft: 10, borderLeft: '2px solid #ccc', color: '#555' },
  statQuestion: { fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 8 },
  optionContainer: { marginBottom: 5, paddingLeft: 10 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10, color: '#444', marginBottom: 3 },
  progressBarContainer: { height: 8, width: '100%', backgroundColor: '#e0e0e0', borderRadius: 4 },
  progressBar: { height: 8, backgroundColor: '#28a745', borderRadius: 4 },
  footer: { position: 'absolute', bottom: 40, right: 30, fontSize: 10, color: 'grey'},
});

export default function InformePDFDocument({ informe }: { informe: DetalleInformeCatedraCompleto | DetalleInformeSinteticoCompleto}) { 

  return (
    <Document >
      <Page size="A4" style={styles.page}  >
        <View style={styles.header}>
          <Image src={Logo} style={styles.headerImage}></Image>
          <View wrap={true}>
            <Text style={styles.title}>{informe.titulo_formulario}</Text>
            <Text style={styles.subtitle}> {"materia" in informe? "Materia: " + informe.materia : "Departamento: " + informe.departamento}</Text>
            <Text style={styles.subtitle}> Fecha de finalización: {new Date(informe.fecha_completado).toLocaleDateString()}</Text>
          </View >
        </View>
        
        {/*  SECCIÓN: Estadísticas  */}
        {informe.estadisticas && informe.estadisticas.length > 0 && (
          <View style={styles.section} wrap={false}> 
            <Text style={styles.sectionTitle}>Estadísticas de Respuestas Cerradas de estudiantes</Text>
            {informe.estadisticas.map((stat) => {
              const totalVotos = stat.opciones.reduce((sum, opt) => sum + opt.cantidad, 0);
              return (
                <View key={stat.pregunta_id} style={{ marginBottom: 15 }}>
                  <Text style={styles.statQuestion}>{stat.pregunta_texto}</Text>
                  {stat.opciones.map((opcion, index) => {
                    const porcentaje = totalVotos > 0 ? (opcion.cantidad / totalVotos) * 100 : 0;
                    return (
                      <View key={index} style={styles.optionContainer}>
                        <View style={styles.optionRow}>
                          <Text>{opcion.texto_opcion}</Text>
                          <Text>{opcion.cantidad} votos ({porcentaje.toFixed(1)}%)</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View style={[styles.progressBar, { width: `${porcentaje}%` }]} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}



        {/* --- SECCIÓN: Respuestas Abiertas por Aspecto | SOLO PARA INFORMES DE CATEDRA--- */}
        {"respuestas_abiertas_agrupadas" in informe? informe.respuestas_abiertas_agrupadas && informe.respuestas_abiertas_agrupadas.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contenido del Informe por Aspectos</Text>
                {informe.respuestas_abiertas_agrupadas.map(grupo => (
                <View key={grupo.grupo} style={{ marginBottom: 10 }} wrap={false}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 8, color: '#555' }}>
                    {grupo.grupo !== 'SIN_GRUPO' ? `${grupo.grupo}. ` : ''}{grupo.titulo_grupo}
                  </Text>
                  {grupo.respuestas.map((res, index) => (
                    <View key={index} style={styles.responseContainer}>
                      <Text style={styles.question}>{res.pregunta_texto}</Text>
                      <Text style={styles.answer}>{res.respuesta_texto || "(Sin respuesta)"}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
        ) : 
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contenido del Informe por Aspectos</Text>
                {informe.respuestas_sintesis_agrupadas.map(grupo => (
                <View key={grupo.grupo} style={{ marginBottom: 10 }} wrap={false}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 8, color: '#555' }}>
                    {grupo.grupo !== 'SIN_GRUPO' ? `${grupo.grupo}. ` : ''}{grupo.titulo_grupo}
                  </Text>
                  {grupo.respuestas.map((res, index) => (
                    <View key={index} style={styles.responseContainer}>
                      <Text style={styles.question}>{res.pregunta_texto}</Text>
                      <Text style={styles.answer}>{res.respuesta_texto || "(Sin respuesta)"}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
        }
      <Text fixed style={styles.footer} render={({ pageNumber, totalPages }) => `${pageNumber} de ${totalPages}`} />
      </Page>
    </Document>
  );
}