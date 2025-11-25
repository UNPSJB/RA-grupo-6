import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { DetalleInformeSinteticoCompleto } from "../types";
import Logo from "../../assets/Unipat.png";

const styles = StyleSheet.create({
    page: { padding: 80, fontFamily: 'Helvetica', fontSize: 11, color: '#333', lineHeight: 1.4},
    header: { marginBottom: 20, borderBottom: '2px solid #eee', paddingBottom: 10 },
    headerImage: {width: 80, opacity: 0.5, position: "absolute", top: 0, right: 10},
    title: { fontSize: 20, fontFamily: 'Helvetica-Bold', textAlign: "center", color: '#1a365d', marginBottom: 25},
    subtitle: { fontSize: 12, color: '#666', textAlign: "left", marginBottom: 4},
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', padding: 8, marginBottom: 12, borderRadius: 4, textAlign: 'center' },
    groupTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#2d3748', marginBottom: 10, paddingBottom: 5, borderBottom: '1px solid #e2e8f0', textAlign: 'left'},
    responseContainer: { marginBottom: 15, paddingLeft: 10 },
    question: { fontFamily: 'Helvetica-Bold', marginBottom: 6, fontSize: 10, color: '#2d3748' },
    answer: { paddingLeft: 12, borderLeft: '3px solid #cbd5e0', color: '#4a5568', fontSize: 10, lineHeight: 1.5 },
    pageNumber: { position: 'absolute', bottom: 35, right: 30, fontSize: 10, color: 'grey'},
    footerText: { position: 'absolute', bottom: 35, left: 40, textAlign: 'left', fontSize: 9},
});

export default function InformeSinteticoPDFDocument({ informe }: { informe: DetalleInformeSinteticoCompleto }) {

    const formatText = (text: string) => {
        if (!text) return '';
        return text.length > 500 ? text.substring(0, 500) + '...' : text;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header con logo centrado */}
                <View style={styles.header}>
                    <Text style={styles.title}>{informe.titulo_formulario}</Text>
                    <Image src={Logo} style={styles.headerImage}></Image>
                    <Text style={styles.subtitle}>Departamento: {informe.departamento}</Text>
                    <Text style={styles.subtitle}>
                        Fecha de finalización: {new Date(informe.fecha_completado).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                {/* Contenido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Síntesis del Informe</Text>
                    {informe.respuestas_sintesis_agrupadas.map((grupo, grupoIndex) => (
                        <View key={grupo.grupo} style={{ marginBottom: grupoIndex < informe.respuestas_sintesis_agrupadas.length - 1 ? 20 : 0 }} >

                            {/* Título del Grupo */}
                            <Text style={styles.groupTitle}>
                                {grupo.titulo_grupo}
                            </Text>

                            {/* Preguntas y Respuestas del Grupo */}
                            {grupo.respuestas.map((respuesta, respuestaIndex) => (
                                <View key={respuestaIndex} style={styles.responseContainer} >
                                    <Text style={styles.question}>
                                        {respuesta.pregunta_texto}
                                    </Text>
                                    <Text style={styles.answer}>
                                        {formatText(respuesta.respuesta_texto) || "(Sin respuesta)"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <Text fixed style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} de ${totalPages}`} />
                <Text fixed style={styles.footerText}> Sistema de Reportes Académicos - Universidad Nacional de la Patagonia San Juan Bosco </Text>

            </Page>
        </Document>
    );
}