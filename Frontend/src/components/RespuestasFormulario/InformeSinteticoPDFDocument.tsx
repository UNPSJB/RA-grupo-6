import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { DetalleInformeSinteticoCompleto } from "../types";
import Logo from "../../assets/Unipat.png";

interface DatosMateriaInstancia {
    instancia: number;
    codigo: string;
    nombre: string;
}

const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 60,
        paddingHorizontal: 50,
        fontFamily: 'Helvetica',
        fontSize: 11,
        color: '#333'
    },
    header: { 
        marginBottom: 20, 
        paddingBottom: 10,
        borderBottom: '2px solid #e2e8f0'
    },
    headerImage: {
        width: 80, 
        opacity: 0.5, 
        position: "absolute", 
        top: 0, 
        right: 10
    },
    title: {
        fontSize: 20,
        fontFamily: 'Helvetica-Bold',
        textAlign: "center",
        color: '#1a365d',
        marginBottom: 15
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: "left",
        marginBottom: 4
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        padding: 8,
        marginBottom: 12,
        textAlign: 'center',
        backgroundColor: '#f0f6ff',
        color: '#1a365d',
        minPresenceAhead: 50
    },
    groupTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: '#0d6efd',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#f0f6ff',
        textAlign: 'left',
        minPresenceAhead: 50
    },
    responseContainer: {
        marginBottom: 15,
        paddingLeft: 10
    },
    question: {
        fontFamily: 'Helvetica-Bold',
        marginBottom: 6,
        fontSize: 10,
        color: '#2d3748'
    },
    answer: {
        paddingLeft: 12,
        color: '#4a5568',
        fontSize: 10
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 50,
        fontSize: 9,
        color: '#666'
    },
    footerText: {
        position: 'absolute',
        bottom: 35,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 9,
        color: '#666',
        borderTop: '1px solid #e2e8f0',
        paddingTop: 10
    },
    table: {
        marginBottom: 15
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#816767',
        padding: 8
    },
    tableHeaderCell: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: 'white',
        textAlign: 'center',
        flex: 1
    },
    tableRow: {
        flexDirection: 'row',
        padding: 6
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'center',
        flex: 1,
        color: '#4a5568'
    },
    materiaInfo: {
        marginBottom: 10,
        padding: 8,
        backgroundColor: '#f0f6ff',
        minPresenceAhead: 50
    },
    materiaText: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#0d6efd'
    }
});

export default function InformeSinteticoPDFDocument({ informe }: { informe: DetalleInformeSinteticoCompleto }) {

    const formatText = (text: string) => {
        if (!text) return '';
        return text.length > 500 ? text.substring(0, 500) + '...' : text;
    };

    const esInformeSintetico = informe.titulo_formulario && informe.titulo_formulario.includes('Sintético');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <Text style={styles.title}>{informe.titulo_formulario || 'Informe'}</Text>
                    <Image src={Logo} style={styles.headerImage}></Image>
                    <Text style={styles.subtitle}>Departamento: {informe.departamento || 'Ingenería'}</Text>
                    <Text style={styles.subtitle}>
                        Fecha: {informe.fecha_completado ? new Date(informe.fecha_completado).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }) : 'N/A'}
                    </Text>
                </View>

                {esInformeSintetico && informe.datos_tabla && Array.isArray(informe.datos_tabla) && informe.datos_tabla.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información General del Departamento</Text>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderCell}>Código</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Asignatura</Text>
                                <Text style={styles.tableHeaderCell}>Inscriptos</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Com. Teóricas</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Com. Prácticas</Text>
                            </View>
                            {informe.datos_tabla.map((fila: any, index: number) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{fila.codAsignatura || '-'}</Text>
                                    <Text style={[styles.tableCell, { flex: 2, textAlign: 'left' }]}>{fila.asignatura || '-'}</Text>
                                    <Text style={styles.tableCell}>{fila.inscriptos !== undefined && fila.inscriptos !== null ? fila.inscriptos : '-'}</Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                                        {Array.isArray(fila.comisionesTeoricas) 
                                            ? fila.comisionesTeoricas.join(', ') 
                                            : fila.comisionesTeoricas || '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{fila.comisionesPracticas || '-'}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Síntesis del Informe</Text>
                    {informe.respuestas_sintesis_agrupadas && informe.respuestas_sintesis_agrupadas.map((grupo, grupoIndex) => {
                       
                        if (esInformeSintetico && grupoIndex === 0 && !(grupo as any).datos_materia_agrupada) {
                            return null;
                        }

                        const datosMateria = (grupo as any).datos_materia_agrupada as DatosMateriaInstancia | undefined;

                        return (
                            <View key={grupo.grupo} style={{ marginBottom: 15 }} wrap={false}>
                                {datosMateria ? (
                                    <View style={styles.materiaInfo}>
                                        <Text style={styles.materiaText}>
                                            {datosMateria.nombre} (Código: {datosMateria.codigo})
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.materiaInfo}>
                                        <Text style={styles.materiaText}>
                                            {grupo.titulo_grupo}
                                        </Text>
                                    </View>
                                )}

                                {grupo.respuestas && grupo.respuestas.map((respuesta, respuestaIndex) => (
                                    <View key={respuestaIndex} style={styles.responseContainer}>
                                        <Text style={styles.question}>
                                            {respuesta.pregunta_texto}
                                        </Text>
                                        <Text style={styles.answer}>
                                            {formatText(respuesta.respuesta_texto) || "(Sin respuesta)"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>

                <View fixed style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <Text style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
                    />
                    <Text style={styles.footerText}>
                        Sistema de Reportes Académicos - Universidad Nacional de la Patagonia San Juan Bosco
                    </Text>
                </View>

            </Page>
        </Document>
    );
}